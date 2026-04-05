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
    const message = err.response?.data?.error?.message || `${serviceName} service unavailable`;
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

module.exports = { proxyRequest, checkServiceHealth };
