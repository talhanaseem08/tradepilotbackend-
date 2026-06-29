const { ValidationError } = require("../utils/errors");

const BLOCKED_KEYS = new Set(["__proto__", "prototype", "constructor"]);

function assertSafeKeys(value, path = "input", depth = 0) {
  if (value == null) return;
  if (depth > 20) {
    throw new ValidationError(`${path} is too deeply nested`);
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => assertSafeKeys(item, `${path}[${index}]`, depth + 1));
    return;
  }

  if (typeof value !== "object") return;

  for (const key of Object.keys(value)) {
    if (
      key.startsWith("$") ||
      key.includes(".") ||
      BLOCKED_KEYS.has(key)
    ) {
      throw new ValidationError(`${path} contains unsafe field name: ${key}`);
    }
    assertSafeKeys(value[key], `${path}.${key}`, depth + 1);
  }
}

function requestSanitizer(req, _res, next) {
  try {
    assertSafeKeys(req.body, "body");
    assertSafeKeys(req.query, "query");
    assertSafeKeys(req.params, "params");
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = requestSanitizer;
