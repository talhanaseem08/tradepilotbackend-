const axios = require("axios");
const config = require("../config");
const logger = require("../utils/logger");

const serviceClients = {
  nlp: axios.create({ baseURL: config.services.nlp, timeout: 30000 }),
  /** Script backtests fetch 30 days of candles + compute — allow long OANDA ranges. */
  trading: axios.create({ baseURL: config.services.trading, timeout: 120000 }),
  agent: axios.create({ baseURL: config.services.agent, timeout: 30000 }),
};

const SERVICE_UNAVAILABLE_MESSAGE = {
  nlp: "AI service is temporarily unavailable. Please try again in a moment.",
  trading: "Trading service is temporarily unavailable. Please try again in a moment.",
  agent: "Safety check service is temporarily unavailable. Please try again in a moment.",
};

function friendlyMessageForStatus(serviceName, status) {
  if (status === 400 || status === 422) {
    return "Some information is missing or invalid. Please check and try again.";
  }
  if (status === 401) return "Please sign in again.";
  if (status === 403) return "You do not have permission to do that.";
  if (status === 404) return "We could not find the requested item.";
  if (status === 429) return "Too many requests. Please wait a moment and try again.";
  if (status >= 500) {
    return SERVICE_UNAVAILABLE_MESSAGE[serviceName] || "A service is temporarily unavailable. Please try again in a moment.";
  }
  return "Something went wrong. Please try again.";
}

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
    logger.error({
      message: "Service proxy error",
      serviceName,
      method,
      path,
      status,
      code: err.code,
      error: err.message,
      upstreamData: data,
      stack: err.stack,
      correlationId,
    });
    const proxyError = new Error(friendlyMessageForStatus(serviceName, status));
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
