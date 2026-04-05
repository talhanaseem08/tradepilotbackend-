const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const config = require("./config");
const connectDB = require("./config/database");
const redis = require("./config/redis");
const logger = require("./utils/logger");
const errorHandler = require("./middleware/errorHandler");
const correlationId = require("./middleware/correlationId");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(correlationId);

app.get("/health", async (_req, res) => {
  const redisOk = redis.status === "ready";
  const status = redisOk ? "ok" : "degraded";
  res.status(redisOk ? 200 : 503).json({
    status,
    service: "gateway",
    redis: redisOk ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);

app.use(errorHandler);

async function start() {
  await connectDB();
  app.listen(config.port, () => {
    logger.info(`Gateway service running on port ${config.port}`);
  });
}

start();

module.exports = app;
