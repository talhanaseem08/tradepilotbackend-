const axios = require("axios");
const config = require("../config");
const logger = require("../utils/logger");

const serviceClients = {
  nlp: axios.create({ baseURL: config.services.nlp, timeout: 30000 }),
  trading: axios.create({ baseURL: config.services.trading, timeout: 30000 }),
  agent: axios.create({ baseURL: config.services.agent, timeout: 30000 }),
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
      message = `${serviceName} unreachable (${err.code}). Is it running? For gateway on the host use TRADING_SERVICE_URL=http://localhost:8002; in Docker Compose use http://trading-service:8002.`;
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
