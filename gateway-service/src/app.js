const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const config = require("./config");
const logger = require("./utils/logger");
const errorHandler = require("./middleware/errorHandler");
const correlationId = require("./middleware/correlationId");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(correlationId);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "gateway", timestamp: new Date().toISOString() });
});

app.use(errorHandler);

app.listen(config.port, () => {
  logger.info(`Gateway service running on port ${config.port}`);
});

module.exports = app;
