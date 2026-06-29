const crypto = require("crypto");
const BrokerAccount = require("../models/BrokerAccount");
const { proxyRequest } = require("../services/serviceProxy");
const { ValidationError } = require("../utils/errors");
const {
  normalizeBinancePayload,
  normalizeBrokerType,
  normalizeOandaPayload,
} = require("../utils/brokerValidation");
const logger = require("../utils/logger");

const ALGO = "aes-256-gcm";

function _getKey() {
  const raw = process.env.ENCRYPTION_KEY || "";
  if (!raw) throw new Error("ENCRYPTION_KEY env var not set");
  // Derive 32-byte key from whatever the user set
  return crypto.createHash("sha256").update(raw).digest();
}

function encrypt(text) {
  const key = _getKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, key, iv);
  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  // Store as hex: iv:tag:ciphertext
  return `${iv.toString("hex")}:${tag.toString("hex")}:${encrypted.toString("hex")}`;
}

function decrypt(stored) {
  try {
    const key = _getKey();
    const [ivHex, tagHex, ctHex] = stored.split(":");
    if (!ivHex || !tagHex || !ctHex) return null;
    const decipher = crypto.createDecipheriv(ALGO, key, Buffer.from(ivHex, "hex"));
    decipher.setAuthTag(Buffer.from(tagHex, "hex"));
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(ctHex, "hex")),
      decipher.final(),
    ]);
    return decrypted.toString("utf8");
  } catch {
    return null;
  }
}

function validateBrokerInput(normalize, value) {
  try {
    return normalize(value);
  } catch (err) {
    throw new ValidationError(err.message || "Invalid broker credentials");
  }
}

function brokerConnectionMessage(brokerLabel) {
  return `We could not connect to your ${brokerLabel} account. Please check the details and try again.`;
}

function brokerErrorResponse(req, res, status, message) {
  return res.status(status).json({
    error: {
      message,
      correlationId: req.correlationId,
    },
  });
}

function logBrokerVerificationFailure(req, brokerName, verifyResult) {
  logger.warn({
    message: "Broker verification failed",
    brokerName,
    userId: req.user.id,
    upstreamError: verifyResult?.error,
    correlationId: req.correlationId,
  });
}

function brokerCredentialReadFailed(req, brokerName) {
  logger.error({
    message: "Broker credential decrypt failed",
    brokerName,
    userId: req.user.id,
    correlationId: req.correlationId,
  });
  return {
    message: `We could not verify your ${brokerName.toUpperCase()} connection right now. Please reconnect the account.`,
  };
}

async function setupOandaAccount(req, res, next) {
  try {
    const { apiKey, accountId, environment } = validateBrokerInput(normalizeOandaPayload, req.body);

    const verifyResult = await proxyRequest("trading", "POST", "/broker/verify/oanda", {
      apiKey,
      accountId,
      environment,
    }, req.correlationId);

    if (!verifyResult.success) {
      logBrokerVerificationFailure(req, "oanda", verifyResult);
      return brokerErrorResponse(req, res, 400, brokerConnectionMessage("OANDA"));
    }

    await BrokerAccount.findOneAndUpdate(
      { userID: req.user.id, brokerName: "oanda" },
      {
        userID: req.user.id,
        brokerName: "oanda",
        apiKey: encrypt(apiKey),
        accountId,
        environment,
        isVerified: true,
        lastVerified: new Date(),
      },
      { upsert: true, new: true }
    );

    logger.info({
      message: "OANDA account setup successful",
      userId: req.user.id,
      accountId,
      environment,
      correlationId: req.correlationId,
    });

    res.json({
      success: true,
      message: "OANDA account connected successfully",
      accountInfo: {
        accountId,
        environment,
        balance: verifyResult.balance,
        currency: verifyResult.currency,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function setupBinanceAccount(req, res, next) {
  try {
    const { apiKey, secretKey, isTestnet } = validateBrokerInput(normalizeBinancePayload, req.body);

    const verifyResult = await proxyRequest(
      "trading",
      "POST",
      "/broker/verify/binance",
      {
        apiKey,
        secretKey,
        isTestnet,
      },
      req.correlationId
    );

    if (!verifyResult.success) {
      logBrokerVerificationFailure(req, "binance", verifyResult);
      return brokerErrorResponse(req, res, 400, brokerConnectionMessage("Binance"));
    }

    await BrokerAccount.findOneAndUpdate(
      { userID: req.user.id, brokerName: "binance" },
      {
        userID: req.user.id,
        brokerName: "binance",
        apiKey: encrypt(apiKey),
        secretKey: encrypt(secretKey),
        isTestnet: !!isTestnet,
        isVerified: true,
        lastVerified: new Date(),
      },
      { upsert: true, new: true }
    );

    logger.info({
      message: "Binance account setup successful",
      userId: req.user.id,
      isTestnet: !!isTestnet,
      correlationId: req.correlationId,
    });

    res.json({
      success: true,
      message: "Binance account connected successfully",
      accountInfo: {
        isTestnet: !!isTestnet,
        balance: verifyResult.balance,
        currency: verifyResult.currency || "USDT",
      },
    });
  } catch (err) {
    next(err);
  }
}

async function verifyBrokerConnection(req, res, next) {
  try {
    const brokerType = validateBrokerInput(normalizeBrokerType, req.params.brokerType);

    const account = await BrokerAccount.findOne({
      userID: req.user.id,
      brokerName: brokerType,
    });

    if (!account) {
      return brokerErrorResponse(req, res, 404, "This broker account is not connected yet.");
    }

    let verifyResult;

    if (brokerType === "oanda") {
      const apiKey = decrypt(account.apiKey);
      if (!apiKey) {
        const safeError = brokerCredentialReadFailed(req, "oanda");
        return brokerErrorResponse(req, res, 500, safeError.message);
      }
      verifyResult = await proxyRequest("trading", "POST", "/broker/verify/oanda", {
        apiKey,
        accountId: account.accountId,
        environment: account.environment,
      }, req.correlationId);
    } else if (brokerType === "binance") {
      const apiKey = decrypt(account.apiKey);
      const secretKey = decrypt(account.secretKey);
      if (!apiKey || !secretKey) {
        const safeError = brokerCredentialReadFailed(req, "binance");
        return brokerErrorResponse(req, res, 500, safeError.message);
      }
      verifyResult = await proxyRequest("trading", "POST", "/broker/verify/binance", {
        apiKey,
        secretKey,
        isTestnet: !!account.isTestnet,
      }, req.correlationId);
    }

    if (verifyResult && verifyResult.success) {
      await BrokerAccount.findOneAndUpdate(
        { userID: req.user.id, brokerName: brokerType },
        { isVerified: true, lastVerified: new Date() }
      );
    }

    res.json(verifyResult);
  } catch (err) {
    next(err);
  }
}

async function getBrokerAccounts(req, res, next) {
  try {
    const accounts = await BrokerAccount.find({
      userID: req.user.id,
      brokerName: { $in: ["oanda", "binance"] },
    }).select("-apiKey -secretKey");

    const result = {};
    for (const acct of accounts) {
      result[acct.brokerName] = {
        brokerName: acct.brokerName,
        isVerified: acct.isVerified,
        lastVerified: acct.lastVerified,
        ...(acct.brokerName === "oanda" && { accountId: acct.accountId, environment: acct.environment }),
        ...(acct.brokerName === "binance" && { isTestnet: acct.isTestnet }),
      };
    }

    res.json({ accounts: result });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  setupOandaAccount,
  setupBinanceAccount,
  verifyBrokerConnection,
  getBrokerAccounts,
};
