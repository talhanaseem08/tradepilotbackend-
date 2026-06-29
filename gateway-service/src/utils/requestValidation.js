const { ValidationError } = require("./errors");

const MARKETS = new Set(["forex", "crypto"]);
const TIMEFRAMES = new Set(["1m", "5m", "15m", "30m", "1h", "4h", "1d"]);
const BOT_TYPES = new Set([
  "low_risk",
  "medium_risk",
  "high_risk",
  "crypto_low",
  "crypto_medium",
  "crypto_high",
]);
const BOT_STATUSES = new Set(["active", "paused", "stopped"]);
const BROKER_MODES = new Set(["paper", "broker"]);
const TRADE_STATUSES = new Set(["open", "closed", "failed", "rejected", "canceled", "cancelled", "error"]);
const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;
const SAFE_ID = /^[A-Za-z0-9_-]{1,64}$/;
const OBJECT_ID = /^[a-fA-F0-9]{24}$/;
const SYMBOL = /^[A-Za-z0-9/_:-]{1,32}$/;

function fail(message) {
  throw new ValidationError(message);
}

function isPlainObject(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null)
  );
}

function requirePlainObject(value, fieldName = "Request body") {
  if (!isPlainObject(value)) fail(`${fieldName} must be an object`);
  return value;
}

function rejectUnknownFields(body, allowedFields, fieldName = "Request body") {
  const allowed = new Set(allowedFields);
  for (const key of Object.keys(body)) {
    if (!allowed.has(key)) fail(`${fieldName} contains unsupported field: ${key}`);
  }
}

function cleanString(value, fieldName, options = {}) {
  const { required = false, max = 128, pattern, enumValues, uppercase = false, lowercase = false } = options;

  if (value == null || value === "") {
    if (required) fail(`${fieldName} is required`);
    return undefined;
  }
  if (typeof value !== "string") fail(`${fieldName} must be a string`);

  let normalized = value.trim();
  if (!normalized) {
    if (required) fail(`${fieldName} is required`);
    return undefined;
  }
  if (normalized.length > max) fail(`${fieldName} must be ${max} characters or fewer`);
  if (/[\u0000-\u001f\u007f]/.test(normalized)) fail(`${fieldName} contains invalid characters`);
  if (pattern && !pattern.test(normalized)) fail(`${fieldName} has invalid format`);

  if (lowercase) normalized = normalized.toLowerCase();
  if (uppercase) normalized = normalized.toUpperCase();
  if (enumValues && !enumValues.has(normalized)) {
    fail(`${fieldName} must be one of: ${Array.from(enumValues).join(", ")}`);
  }

  return normalized;
}

function cleanBoolean(value, fieldName, options = {}) {
  const { required = false, defaultValue } = options;
  if (value == null) {
    if (required) fail(`${fieldName} is required`);
    return defaultValue;
  }
  if (typeof value !== "boolean") fail(`${fieldName} must be true or false`);
  return value;
}

function cleanNumber(value, fieldName, options = {}) {
  const { required = false, defaultValue, min = -Number.MAX_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER } = options;
  if (value == null || value === "") {
    if (required) fail(`${fieldName} is required`);
    return defaultValue;
  }

  const numberValue = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(numberValue)) fail(`${fieldName} must be a number`);
  if (numberValue < min || numberValue > max) fail(`${fieldName} must be between ${min} and ${max}`);
  return numberValue;
}

function cleanInteger(value, fieldName, options = {}) {
  const numberValue = cleanNumber(value, fieldName, options);
  if (numberValue == null) return numberValue;
  if (!Number.isInteger(numberValue)) fail(`${fieldName} must be an integer`);
  return numberValue;
}

function cleanDateOnly(value, fieldName, options = {}) {
  const normalized = cleanString(value, fieldName, { ...options, max: options.max || 10 });
  if (normalized == null) return undefined;
  if (!DATE_ONLY.test(normalized)) fail(`${fieldName} must use YYYY-MM-DD format`);

  const date = new Date(`${normalized}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== normalized) {
    fail(`${fieldName} must be a valid date`);
  }
  return normalized;
}

function cleanDateTime(value, fieldName, options = {}) {
  const normalized = cleanString(value, fieldName, { ...options, max: options.max || 40 });
  if (normalized == null) return undefined;
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) fail(`${fieldName} must be a valid date/time`);
  return normalized;
}

function cleanArray(value, fieldName, options = {}) {
  const { required = false, max = 100 } = options;
  if (value == null) {
    if (required) fail(`${fieldName} is required`);
    return undefined;
  }
  if (!Array.isArray(value)) fail(`${fieldName} must be an array`);
  if (value.length > max) fail(`${fieldName} can contain at most ${max} items`);
  return value;
}

function cleanSafeId(value, fieldName, options = {}) {
  return cleanString(value, fieldName, { required: options.required ?? true, max: 64, pattern: SAFE_ID });
}

function cleanObjectId(value, fieldName, options = {}) {
  return cleanString(value, fieldName, { required: options.required ?? true, max: 24, pattern: OBJECT_ID });
}

function cleanSymbol(value, fieldName = "Symbol", options = {}) {
  return cleanString(value, fieldName, {
    required: options.required ?? true,
    max: 32,
    pattern: SYMBOL,
    uppercase: true,
  });
}

function sanitizeJsonValue(value, fieldName, depth = 0) {
  if (depth > 4) fail(`${fieldName} is too deeply nested`);
  if (value == null || typeof value === "boolean") return value;
  if (typeof value === "string") return cleanString(value, fieldName, { max: 512 });
  if (typeof value === "number") {
    if (!Number.isFinite(value)) fail(`${fieldName} must be a finite number`);
    if (value < -1_000_000_000 || value > 1_000_000_000) fail(`${fieldName} number is outside allowed range`);
    return value;
  }
  if (Array.isArray(value)) {
    if (value.length > 100) fail(`${fieldName} can contain at most 100 items`);
    return value.map((item, index) => sanitizeJsonValue(item, `${fieldName}[${index}]`, depth + 1));
  }
  if (isPlainObject(value)) {
    const entries = Object.entries(value);
    if (entries.length > 50) fail(`${fieldName} can contain at most 50 keys`);
    const output = {};
    for (const [key, nestedValue] of entries) {
      const cleanKey = cleanString(key, `${fieldName} key`, { required: true, max: 64, pattern: /^[A-Za-z0-9_.-]+$/ });
      output[cleanKey] = sanitizeJsonValue(nestedValue, `${fieldName}.${cleanKey}`, depth + 1);
    }
    return output;
  }
  fail(`${fieldName} contains unsupported value`);
}

function sanitizeParameters(value, fieldName = "parameters") {
  if (value == null) return {};
  if (!isPlainObject(value)) fail(`${fieldName} must be an object`);
  return sanitizeJsonValue(value, fieldName);
}

function sanitizeCandles(value) {
  const candles = cleanArray(value, "candles", { max: 5000 }) || [];
  return candles.map((candle, index) => {
    if (!isPlainObject(candle)) fail(`candles[${index}] must be an object`);
    const output = {};
    for (const [key, raw] of Object.entries(candle)) {
      const cleanKey = cleanString(key, `candles[${index}] key`, { required: true, max: 32, pattern: /^[A-Za-z0-9_.-]+$/ });
      if (cleanKey.toLowerCase().includes("time") || cleanKey.toLowerCase().includes("date")) {
        output[cleanKey] = cleanDateTime(raw, `candles[${index}].${cleanKey}`);
      } else if (typeof raw === "string" && raw.trim() && Number.isNaN(Number(raw))) {
        output[cleanKey] = cleanString(raw, `candles[${index}].${cleanKey}`, { max: 64 });
      } else {
        output[cleanKey] = cleanNumber(raw, `candles[${index}].${cleanKey}`, { min: -1_000_000_000, max: 1_000_000_000 });
      }
    }
    return output;
  });
}

function validateParseRequest(body) {
  const input = requirePlainObject(body);
  rejectUnknownFields(input, ["prompt"]);
  return {
    prompt: cleanString(input.prompt, "prompt", { required: true, max: 2000 }),
  };
}

function validateSentimentRequest(body) {
  const input = requirePlainObject(body);
  rejectUnknownFields(input, ["symbol", "market"]);
  return {
    symbol: cleanSymbol(input.symbol),
    market: cleanString(input.market ?? "forex", "market", { enumValues: MARKETS, lowercase: true }),
  };
}

function validateForexGuardRequest(body) {
  const input = requirePlainObject(body);
  rejectUnknownFields(input, ["symbol", "market", "current_time", "include_ai"]);
  return {
    symbol: cleanSymbol(input.symbol),
    market: cleanString(input.market ?? "forex", "market", { enumValues: MARKETS, lowercase: true }),
    current_time: cleanDateTime(input.current_time, "current_time"),
    include_ai: cleanBoolean(input.include_ai, "include_ai", { defaultValue: false }),
  };
}

function validateTradeExplanationRequest(body) {
  const input = requirePlainObject(body);
  rejectUnknownFields(input, ["trade"]);

  const trade = requirePlainObject(input.trade, "trade");
  rejectUnknownFields(trade, [
    "trade_id",
    "symbol",
    "market",
    "side",
    "status",
    "opened_at",
    "closed_at",
    "entry_price",
    "exit_price",
    "stop_loss",
    "take_profit",
    "pnl",
    "quantity",
    "bot_id",
    "bot_type",
    "timeframe",
  ], "trade");

  const sides = new Set(["buy", "sell", "long", "short"]);
  return {
    trade: {
      trade_id: cleanString(trade.trade_id, "trade.trade_id", { required: true, max: 64 }),
      symbol: cleanSymbol(trade.symbol, "trade.symbol"),
      market: cleanString(trade.market ?? "crypto", "trade.market", { enumValues: MARKETS, lowercase: true }),
      ...(trade.side != null ? { side: cleanString(trade.side, "trade.side", { max: 16, enumValues: sides, lowercase: true }) } : {}),
      ...(trade.status != null ? { status: cleanString(trade.status, "trade.status", { max: 24 }) } : {}),
      ...(trade.opened_at != null ? { opened_at: cleanDateTime(trade.opened_at, "trade.opened_at") } : {}),
      ...(trade.closed_at != null ? { closed_at: cleanDateTime(trade.closed_at, "trade.closed_at") } : {}),
      ...(trade.entry_price != null ? { entry_price: cleanNumber(trade.entry_price, "trade.entry_price", { min: 0, max: 1_000_000_000 }) } : {}),
      ...(trade.exit_price != null ? { exit_price: cleanNumber(trade.exit_price, "trade.exit_price", { min: 0, max: 1_000_000_000 }) } : {}),
      ...(trade.stop_loss != null ? { stop_loss: cleanNumber(trade.stop_loss, "trade.stop_loss", { min: 0, max: 1_000_000_000 }) } : {}),
      ...(trade.take_profit != null ? { take_profit: cleanNumber(trade.take_profit, "trade.take_profit", { min: 0, max: 1_000_000_000 }) } : {}),
      ...(trade.pnl != null ? { pnl: cleanNumber(trade.pnl, "trade.pnl", { min: -1_000_000_000, max: 1_000_000_000 }) } : {}),
      ...(trade.quantity != null ? { quantity: cleanNumber(trade.quantity, "trade.quantity", { min: 0, max: 1_000_000_000 }) } : {}),
      ...(trade.bot_id != null ? { bot_id: cleanString(trade.bot_id, "trade.bot_id", { max: 64 }) } : {}),
      ...(trade.bot_type != null ? { bot_type: cleanString(trade.bot_type, "trade.bot_type", { max: 64 }) } : {}),
      ...(trade.timeframe != null ? { timeframe: cleanString(trade.timeframe, "trade.timeframe", { enumValues: TIMEFRAMES }) } : {}),
    },
  };
}

function validateBotCreate(body) {
  const input = requirePlainObject(body);
  rejectUnknownFields(input, ["bot_type", "symbol", "market", "timeframe", "parameters", "broker_mode"]);
  return {
    bot_type: cleanString(input.bot_type, "bot_type", { required: true, max: 32, enumValues: BOT_TYPES }),
    symbol: cleanSymbol(input.symbol),
    market: cleanString(input.market ?? "forex", "market", { enumValues: MARKETS, lowercase: true }),
    timeframe: cleanString(input.timeframe ?? "1h", "timeframe", { enumValues: TIMEFRAMES }),
    parameters: sanitizeParameters(input.parameters),
    broker_mode: cleanString(input.broker_mode ?? "paper", "broker_mode", { enumValues: BROKER_MODES }),
  };
}

function validateBotFromParse(body) {
  const input = requirePlainObject(body);
  rejectUnknownFields(input, [
    "intent",
    "risk_level",
    "market",
    "strategy_type",
    "analysis_mode",
    "symbol",
    "timeframe",
    "stop_loss_pips",
    "take_profit_pips",
    "confidence",
    "raw_output",
    "broker_mode",
  ]);
  const markets = cleanArray(input.market, "market", { max: 2 }) || undefined;
  return {
    ...(cleanString(input.intent, "intent", { max: 64 }) ? { intent: cleanString(input.intent, "intent", { max: 64 }) } : {}),
    ...(cleanString(input.risk_level, "risk_level", { max: 32 }) ? { risk_level: cleanString(input.risk_level, "risk_level", { max: 32 }) } : {}),
    ...(markets ? { market: markets.map((item, index) => cleanString(item, `market[${index}]`, { required: true, max: 16, enumValues: MARKETS, lowercase: true })) } : {}),
    ...(cleanString(input.strategy_type, "strategy_type", { max: 64 }) ? { strategy_type: cleanString(input.strategy_type, "strategy_type", { max: 64 }) } : {}),
    ...(cleanString(input.analysis_mode, "analysis_mode", { max: 64 }) ? { analysis_mode: cleanString(input.analysis_mode, "analysis_mode", { max: 64 }) } : {}),
    ...(input.symbol != null ? { symbol: cleanSymbol(input.symbol) } : {}),
    ...(input.timeframe != null ? { timeframe: cleanString(input.timeframe, "timeframe", { enumValues: TIMEFRAMES }) } : {}),
    ...(input.stop_loss_pips != null ? { stop_loss_pips: cleanNumber(input.stop_loss_pips, "stop_loss_pips", { min: 0, max: 100000 }) } : {}),
    ...(input.take_profit_pips != null ? { take_profit_pips: cleanNumber(input.take_profit_pips, "take_profit_pips", { min: 0, max: 100000 }) } : {}),
    ...(input.confidence != null ? { confidence: cleanNumber(input.confidence, "confidence", { min: 0, max: 1 }) } : {}),
    ...(input.raw_output != null ? { raw_output: cleanString(input.raw_output, "raw_output", { max: 4000 }) } : {}),
    broker_mode: cleanString(input.broker_mode ?? "paper", "broker_mode", { enumValues: BROKER_MODES }),
  };
}

function validateBotStatus(body) {
  const input = requirePlainObject(body);
  rejectUnknownFields(input, ["status"]);
  return {
    status: cleanString(input.status, "status", { required: true, max: 16, enumValues: BOT_STATUSES }),
  };
}

function validateMarketDataQuery(params, query, options = {}) {
  const allowedFields = ["market"];
  if (options.includeTimeframe) allowedFields.push("timeframe");
  if (options.includeCount) allowedFields.push("count");
  rejectUnknownFields(query || {}, allowedFields, "Query string");
  const output = {
    symbol: options.symbolRequired === false ? cleanSymbol(params?.symbol, "symbol", { required: false }) : cleanSymbol(params?.symbol),
    market: cleanString(query?.market ?? "forex", "market", { enumValues: MARKETS, lowercase: true }),
  };
  if (query?.timeframe != null || options.includeTimeframe) {
    output.timeframe = cleanString(query?.timeframe ?? "1h", "timeframe", { enumValues: TIMEFRAMES });
  }
  if (query?.count != null || options.includeCount) {
    output.count = cleanInteger(query?.count ?? 100, "count", { min: 1, max: 1000 });
  }
  return output;
}

function validateTradesQuery(query) {
  rejectUnknownFields(query || {}, ["bot_id", "symbol", "status", "limit", "page"], "Query string");
  return {
    ...(query?.bot_id != null ? { bot_id: cleanSafeId(query.bot_id, "bot_id") } : {}),
    ...(query?.symbol != null ? { symbol: cleanSymbol(query.symbol) } : {}),
    ...(query?.status != null ? { status: cleanString(query.status, "status", { max: 16, enumValues: TRADE_STATUSES, lowercase: true }) } : {}),
    limit: cleanInteger(query?.limit ?? 50, "limit", { min: 1, max: 500 }),
    page: cleanInteger(query?.page ?? 1, "page", { min: 1, max: 10000 }),
  };
}

function validateBacktestBody(body, options = {}) {
  const input = requirePlainObject(body);
  const allowedFields = ["bot_type", "symbol", "market", "timeframe", "parameters", "candles", "date_from", "date_to"];
  if (options.allowCount) allowedFields.push("count");
  rejectUnknownFields(input, allowedFields);
  const dateFrom = cleanDateOnly(input.date_from, "date_from");
  const dateTo = cleanDateOnly(input.date_to, "date_to");
  if (dateFrom && dateTo && dateFrom > dateTo) fail("date_from must be before or equal to date_to");
  return {
    bot_type: cleanString(input.bot_type, "bot_type", { required: true, max: 32, enumValues: BOT_TYPES }),
    symbol: cleanSymbol(input.symbol),
    market: cleanString(input.market ?? "forex", "market", { enumValues: MARKETS, lowercase: true }),
    timeframe: cleanString(input.timeframe ?? "1h", "timeframe", { enumValues: TIMEFRAMES }),
    parameters: sanitizeParameters(input.parameters),
    candles: options.requireCandles ? sanitizeCandles(input.candles) : sanitizeCandles(input.candles || []),
    ...(dateFrom ? { date_from: dateFrom } : {}),
    ...(dateTo ? { date_to: dateTo } : {}),
  };
}

function validateBacktestRunBody(body) {
  const input = validateBacktestBody(body, { allowCount: true });
  return {
    ...input,
    count: cleanInteger(body?.count ?? 200, "count", { min: 1, max: 1000 }),
  };
}

function validateScriptBacktestBody(body) {
  const input = requirePlainObject(body);
  rejectUnknownFields(input, ["bot_type", "days", "symbol"]);
  return {
    bot_type: cleanString(input.bot_type, "bot_type", { required: true, max: 32, enumValues: BOT_TYPES }),
    days: cleanInteger(input.days ?? 30, "days", { min: 1, max: 365 }),
    ...(input.symbol != null ? { symbol: cleanSymbol(input.symbol) } : {}),
  };
}

function validateReportsQuery(query) {
  rejectUnknownFields(query || {}, ["symbol", "bot_type", "limit", "page"], "Query string");
  return {
    ...(query?.symbol != null ? { symbol: cleanSymbol(query.symbol) } : {}),
    ...(query?.bot_type != null ? { bot_type: cleanString(query.bot_type, "bot_type", { max: 32, enumValues: BOT_TYPES }) } : {}),
    limit: cleanInteger(query?.limit ?? 20, "limit", { min: 1, max: 100 }),
    page: cleanInteger(query?.page ?? 1, "page", { min: 1, max: 10000 }),
  };
}

module.exports = {
  cleanString,
  cleanObjectId,
  cleanSafeId,
  cleanSymbol,
  rejectUnknownFields,
  requirePlainObject,
  validateBacktestBody,
  validateBacktestRunBody,
  validateBotCreate,
  validateBotFromParse,
  validateBotStatus,
  validateForexGuardRequest,
  validateMarketDataQuery,
  validateParseRequest,
  validateReportsQuery,
  validateScriptBacktestBody,
  validateSentimentRequest,
  validateTradeExplanationRequest,
  validateTradesQuery,
};
