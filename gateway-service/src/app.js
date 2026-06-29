const express = require("express");
const http = require("http");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
const config = require("./config");
const connectDB = require("./config/database");
const redis = require("./config/redis");
const logger = require("./utils/logger");
const errorHandler = require("./middleware/errorHandler");
const correlationId = require("./middleware/correlationId");
const requestSanitizer = require("./middleware/requestSanitizer");
const authRoutes = require("./routes/authRoutes");
const proxyRoutes = require("./routes/proxyRoutes");
const brokerRoutes = require("./routes/brokerRoutes");
const userRoutes = require("./routes/userRoutes");
const { initWebSocket, broadcastServiceHealth } = require("./services/websocketManager");
const { initRedisPubSub } = require("./services/redisPubSub");
const { getServicesHealthPayload } = require("./services/serviceProxy");

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: "Too many requests, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

const app = express();
const server = http.createServer(app);

initWebSocket(server);
initRedisPubSub();

// Helmet's default CSP blocks inline <script> (script-src 'self' only) and cross-origin
// fetches to NLP/trading (default-src). Dashboard needs unsafe-inline + local service URLs.
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "script-src": ["'self'", "'unsafe-inline'", "https://cdn.socket.io"],
        "img-src": ["'self'", "data:", "blob:", "https:"],
        "connect-src": [
          "'self'",
          "http://127.0.0.1:8001",
          "http://127.0.0.1:8002",
          "http://localhost:8001",
          "http://localhost:8002",
          "ws:",
          "wss:",
        ],
      },
    },
  })
);
app.use(cors());
app.use(express.json({ limit: "100kb" }));
app.use(correlationId);
app.use(requestSanitizer);

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

// API routes before static files so /api/* is never shadowed by public assets
app.use("/api/auth", authRoutes);
app.use("/api/broker", apiLimiter, brokerRoutes);
app.use("/api/users", apiLimiter, userRoutes);
app.use("/api", apiLimiter, proxyRoutes);

app.use(express.static(path.join(__dirname, "..", "public")));

app.use(errorHandler);

async function broadcastHealthNow() {
  try {
    const payload = await getServicesHealthPayload();
    broadcastServiceHealth(payload);
  } catch (err) {
    logger.error({ message: "Health broadcast failed", error: err.message });
  }
}

setInterval(broadcastHealthNow, 10000);

async function start() {
  await connectDB();
  server.listen(config.port, () => {
    logger.info(`Gateway service running on port ${config.port}`);
    logger.info(`Dashboard: http://localhost:${config.port}`);
    logger.info(
      `Proxy upstreams — NLP: ${config.services.nlp} | trading: ${config.services.trading} | agent: ${config.services.agent}`
    );
    broadcastHealthNow();
  });
}

start();

module.exports = app;
