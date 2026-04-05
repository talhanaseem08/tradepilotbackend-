require("dotenv").config();

const config = {
  port: parseInt(process.env.GATEWAY_PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  mongo: {
    uri: process.env.MONGO_URI || "mongodb://localhost:27017/tradepilot",
  },
  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  },
  jwt: {
    secret: process.env.JWT_SECRET || "dev-secret-change-me",
    expiresIn: process.env.JWT_EXPIRES_IN || "24h",
  },
  services: {
    nlp: process.env.NLP_SERVICE_URL || "http://localhost:8001",
    trading: process.env.TRADING_SERVICE_URL || "http://localhost:8002",
    agent: process.env.AGENT_SERVICE_URL || "http://localhost:8003",
  },
};

module.exports = config;
