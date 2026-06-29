const logger = require("../utils/logger");

function fallbackMessage(statusCode) {
  if (statusCode === 400 || statusCode === 422) {
    return "Some information is missing or invalid. Please check and try again.";
  }
  if (statusCode === 401) return "Please sign in again.";
  if (statusCode === 403) return "You do not have permission to do that.";
  if (statusCode === 404) return "We could not find the requested item.";
  if (statusCode === 429) return "Too many requests. Please wait a moment and try again.";
  if (statusCode >= 500) return "TradePilot is temporarily unavailable. Please try again in a moment.";
  return "Something went wrong. Please try again.";
}

function isTechnicalMessage(message) {
  return /(traceback|stack|mongo|mongodb|mongoose|sql|select |insert |update |delete |ecconnrefused|enotfound|vite_|localhost|127\.0\.0\.1|http:\/\/|https:\/\/|node_modules|\.py|\.js|typeerror|referenceerror|validationerror|pydantic|ccxt|oanda request|binance verification|api key|secret|token|encryption_key|smtp_)/i.test(
    String(message || "")
  );
}

function errorHandler(err, req, res, _next) {
  const correlationId = req.correlationId || "unknown";
  const statusCode = err.statusCode || 500;
  const message =
    err.isOperational && !isTechnicalMessage(err.message)
      ? err.message
      : fallbackMessage(statusCode);

  logger.error({
    message: err.message,
    statusCode,
    correlationId,
    stack: err.stack,
  });

  res.status(statusCode).json({
    error: {
      message,
      correlationId,
    },
  });
}

module.exports = errorHandler;
