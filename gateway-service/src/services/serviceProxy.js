const axios = require("axios");
const config = require("../config");
const logger = require("../utils/logger");

const serviceClients = {
  nlp: axios.create({ baseURL: config.services.nlp, timeout: 30000 }),
  /** Script backtests fetch 30 days of candles + compute — allow long OANDA ranges. */
  trading: axios.create({ baseURL: config.services.trading, timeout: 120000 }),
  agent: axios.create({ baseURL: config.services.agent, timeout: 30000 }),
};

/** Shown on ECONNREFUSED so operators fix the right upstream (calendar/news use NLP, not trading). */
const UPSTREAM_HINT = {
  nlp: "NLP_SERVICE_URL=http://localhost:8001; in Docker Compose use http://nlp-service:8001",
  trading:
    "TRADING_SERVICE_URL=http://localhost:8002; in Docker Compose use http://trading-service:8002",
  agent: "AGENT_SERVICE_URL=http://localhost:8003; in Docker Compose use http://agent-service:8003",
};

async function proxyRequest(serviceName, method, path, data, correlationId) {
  const client = serviceClients[serviceName];
  if (!client) {
    throw new Error(`Unknown service: ${serviceName}`);
  }

  const headers = {};
  if (correlationId) {
    headers["X-Correlation-ID"] = correlationId;
  }

  try {
    const response = await client.request({ method, url: path, data, headers });
    return response.data;
  } catch (err) {
    const status = err.response?.status || 502;
    const data = err.response?.data;
    let message = `${serviceName} service unavailable`;
    if (data) {
      if (typeof data.detail === "string") {
        message = data.detail;
      } else if (Array.isArray(data.detail) && data.detail[0]?.msg) {
        message = data.detail[0].msg;
      } else if (data.error?.message) {
        message = data.error.message;
      }
    } else if (err.code === "ECONNREFUSED" || err.code === "ENOTFOUND") {
      const hint = UPSTREAM_HINT[serviceName] || "check NLP_SERVICE_URL, TRADING_SERVICE_URL, AGENT_SERVICE_URL";
      message = `${serviceName} unreachable (${err.code}). Is it running? For gateway on the host set ${hint}.`;
    } else if (err.message && !data) {
      message = `${serviceName} service unavailable: ${err.message}`;
    }
    logger.error({
      message: "Service proxy error",
      serviceName,
      path,
      status,
      error: err.message,
      correlationId,
    });
    const proxyError = new Error(message);
    proxyError.statusCode = status;
    proxyError.isOperational = true;
    throw proxyError;
  }
}

async function checkServiceHealth(serviceName) {
  try {
    const result = await proxyRequest(serviceName, "GET", "/health", null, null);
    return { service: serviceName, status: result.status };
  } catch {
    return { service: serviceName, status: "unreachable" };
  }
}

/** Same shape as WebSocket `services:health` for immediate UI updates. */
async function getServicesHealthPayload() {
  const [nlp, trading, agent] = await Promise.all([
    checkServiceHealth("nlp"),
    checkServiceHealth("trading"),
    checkServiceHealth("agent"),
  ]);
  return {
    services: [nlp, trading, agent],
    timestamp: new Date().toISOString(),
  };
}

module.exports = { proxyRequest, checkServiceHealth, getServicesHealthPayload };
