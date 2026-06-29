const ALLOWED_BROKERS = new Set(["oanda", "binance"]);
const ALLOWED_OANDA_ENVIRONMENTS = new Set(["practice", "live"]);
const MAX_CREDENTIAL_LENGTH = 512;

function requirePlainObject(value) {
  if (
    value === null ||
    typeof value !== "object" ||
    Array.isArray(value) ||
    (Object.getPrototypeOf(value) !== Object.prototype && Object.getPrototypeOf(value) !== null)
  ) {
    throw new Error("Request body must be an object");
  }
  return value;
}

function rejectUnknownFields(body, allowedFields) {
  const allowed = new Set(allowedFields);
  for (const key of Object.keys(body)) {
    if (!allowed.has(key)) {
      throw new Error(`Request body contains unsupported field: ${key}`);
    }
  }
}

function normalizeRequiredString(value, fieldName, maxLength = MAX_CREDENTIAL_LENGTH) {
  if (typeof value !== "string") {
    throw new Error(`${fieldName} is required`);
  }

  const normalized = value.trim();
  if (!normalized) {
    throw new Error(`${fieldName} is required`);
  }

  if (normalized.length > maxLength) {
    throw new Error(`${fieldName} is too long`);
  }

  if (/[\u0000-\u001f\u007f]/.test(normalized)) {
    throw new Error(`${fieldName} contains invalid characters`);
  }

  return normalized;
}

function normalizeBoolean(value, fieldName, defaultValue) {
  if (value == null) return defaultValue;
  if (typeof value !== "boolean") {
    throw new Error(`${fieldName} must be true or false`);
  }
  return value;
}

function normalizeBrokerType(value) {
  const brokerType = normalizeRequiredString(value, "Broker type", 32).toLowerCase();
  if (!ALLOWED_BROKERS.has(brokerType)) {
    throw new Error("Unsupported broker type");
  }
  return brokerType;
}

function normalizeOandaEnvironment(value = "practice") {
  const environment = normalizeRequiredString(value, "OANDA environment", 32).toLowerCase();
  if (!ALLOWED_OANDA_ENVIRONMENTS.has(environment)) {
    throw new Error("OANDA environment must be practice or live");
  }
  return environment;
}

function normalizeOandaPayload(body) {
  body = requirePlainObject(body);
  rejectUnknownFields(body, ["apiKey", "accountId", "environment"]);
  return {
    apiKey: normalizeRequiredString(body?.apiKey, "OANDA API key"),
    accountId: normalizeRequiredString(body?.accountId, "OANDA account ID", 128),
    environment: normalizeOandaEnvironment(body?.environment ?? "practice"),
  };
}

function normalizeBinancePayload(body) {
  body = requirePlainObject(body);
  rejectUnknownFields(body, ["apiKey", "secretKey", "isTestnet"]);
  return {
    apiKey: normalizeRequiredString(body?.apiKey, "Binance API key"),
    secretKey: normalizeRequiredString(body?.secretKey, "Binance secret key"),
    isTestnet: normalizeBoolean(body?.isTestnet, "Binance testnet flag", true),
  };
}

module.exports = {
  normalizeBinancePayload,
  normalizeBrokerType,
  normalizeOandaPayload,
};
