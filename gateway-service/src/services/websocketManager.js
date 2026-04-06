const { Server } = require("socket.io");
const logger = require("../utils/logger");

let io = null;

function initWebSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    logger.info({ message: "WebSocket client connected", socketId: socket.id });

    socket.on("subscribe:bot", (botId) => {
      socket.join(`bot:${botId}`);
      logger.debug({ message: "Client subscribed to bot", botId, socketId: socket.id });
    });

    socket.on("disconnect", () => {
      logger.debug({ message: "WebSocket client disconnected", socketId: socket.id });
    });
  });

  logger.info("WebSocket server initialized");
  return io;
}

function broadcastServiceHealth(healthData) {
  if (io) io.emit("services:health", healthData);
}

function broadcastTradeResult(tradeData) {
  if (io) {
    io.emit("trade:result", tradeData);
    if (tradeData.botId) {
      io.to(`bot:${tradeData.botId}`).emit("bot:trade", tradeData);
    }
  }
}

function broadcastBotStatus(botId, status, data = {}) {
  if (io) {
    const payload = { botId, status, ...data, timestamp: new Date().toISOString() };
    io.emit("bot:status", payload);
    io.to(`bot:${botId}`).emit("bot:update", payload);
  }
}

function broadcastNews(newsData) {
  if (io) io.emit("news:update", newsData);
}

function broadcastBacktestResult(result) {
  if (io) io.emit("backtest:result", result);
}

function getIO() {
  return io;
}

module.exports = {
  initWebSocket,
  broadcastServiceHealth,
  broadcastTradeResult,
  broadcastBotStatus,
  broadcastNews,
  broadcastBacktestResult,
  getIO,
};
