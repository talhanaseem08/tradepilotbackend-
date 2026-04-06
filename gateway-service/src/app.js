const express = require("express");
const http = require("http");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const config = require("./config");
const connectDB = require("./config/database");
const redis = require("./config/redis");
const logger = require("./utils/logger");
const errorHandler = require("./middleware/errorHandler");
const correlationId = require("./middleware/correlationId");
const authRoutes = require("./routes/authRoutes");
const proxyRoutes = require("./routes/proxyRoutes");
const { initWebSocket, broadcastServiceHealth } = require("./services/websocketManager");
const { initRedisPubSub } = require("./services/redisPubSub");
const { checkServiceHealth } = require("./services/serviceProxy");

const app = express();
const server = http.createServer(app);

initWebSocket(server);
initRedisPubSub();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(correlationId);

app.use(express.static(path.join(__dirname, "..", "public")));

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
app.use("/api", proxyRoutes);

app.use(errorHandler);

setInterval(async () => {
  try {
    const [nlp, trading, agent] = await Promise.all([
      checkServiceHealth("nlp"),
      checkServiceHealth("trading"),
      checkServiceHealth("agent"),
    ]);
    broadcastServiceHealth({ services: [nlp, trading, agent], timestamp: new Date().toISOString() });
  } catch (err) {
    logger.error({ message: "Health broadcast failed", error: err.message });
  }
}, 10000);

async function start() {
  await connectDB();
  server.listen(config.port, () => {
    logger.info(`Gateway service running on port ${config.port}`);
    logger.info(`Dashboard: http://localhost:${config.port}`);
  });
}

start();

module.exports = app;
