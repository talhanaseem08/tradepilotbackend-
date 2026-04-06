const redis = require("../config/redis");
const logger = require("../utils/logger");
const {
  broadcastServiceHealth,
  broadcastTradeResult,
  broadcastBotStatus,
  broadcastNews,
  broadcastBacktestResult,
} = require("./websocketManager");

const DEFAULT_CHANNELS = "tradepilot:events";

function parseChannels() {
  const raw = process.env.REDIS_PUBSUB_CHANNELS || DEFAULT_CHANNELS;
  return raw
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);
}

function dispatchEvent(data) {
  const type = data.type;
  const payload = data.payload !== undefined ? data.payload : data;

  switch (type) {
    case "services:health":
    case "service_health":
      broadcastServiceHealth(payload);
      break;
    case "trade:result":
    case "trade_result":
      broadcastTradeResult(payload);
      break;
    case "bot:status":
    case "bot_status": {
      const { botId, status, ...rest } = payload;
      if (botId != null && status != null) {
        broadcastBotStatus(botId, status, rest);
      } else {
        logger.warn({ message: "bot_status event missing botId or status", payload });
      }
      break;
    }
    case "news:update":
    case "news":
      broadcastNews(payload);
      break;
    case "backtest:result":
    case "backtest_result":
      broadcastBacktestResult(payload);
      break;
    default:
      logger.debug({ message: "Unhandled pub/sub event type", type });
  }
}

function initRedisPubSub() {
  const channels = parseChannels();
  const sub = redis.duplicate();

  sub.on("error", (err) => {
    logger.error({ message: "Redis pub/sub subscriber error", error: err.message });
  });

  sub.subscribe(...channels, (err, count) => {
    if (err) {
      logger.error({ message: "Redis pub/sub subscribe failed", error: err.message });
      return;
    }
    logger.info({ message: "Redis pub/sub listening", channels, count });
  });

  sub.on("message", (channel, message) => {
    try {
      const data = JSON.parse(message);
      if (data && typeof data === "object" && data.type) {
        dispatchEvent(data);
      } else {
        logger.warn({ message: "Pub/sub message missing type", channel });
      }
    } catch (e) {
      logger.warn({ message: "Invalid pub/sub JSON", channel, error: e.message });
    }
  });

  return sub;
}

module.exports = { initRedisPubSub };
