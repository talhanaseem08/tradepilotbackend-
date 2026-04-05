const logger = require("../utils/logger");

function errorHandler(err, req, res, _next) {
  const correlationId = req.correlationId || "unknown";
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : "Internal server error";

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
