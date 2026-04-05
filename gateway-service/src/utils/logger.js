const winston = require("winston");
const config = require("../config");

const logger = winston.createLogger({
  level: config.nodeEnv === "production" ? "info" : "debug",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: "gateway" },
  transports: [new winston.transports.Console()],
});

module.exports = logger;
