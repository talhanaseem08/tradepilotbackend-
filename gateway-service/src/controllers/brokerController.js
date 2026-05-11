const crypto = require("crypto");
const BrokerAccount = require("../models/BrokerAccount");
const { proxyRequest } = require("../services/serviceProxy");
const { ValidationError } = require("../utils/errors");
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

async function setupMT5Account(req, res, next) {
  try {
    const { login, password, server } = req.body;

    if (!login || !password || !server) {
      throw new ValidationError("MT5 login, password, and server are required");
    }

    const verifyResult = await proxyRequest("trading", "POST", "/broker/verify/mt5", {
      login: parseInt(login),
      password,
      server,
    }, req.correlationId);

    if (!verifyResult.success) {
      return res.status(400).json({
        error: "Failed to connect to MT5 account",
        details: verifyResult.error,
      });
    }

    await BrokerAccount.findOneAndUpdate(
      { userID: req.user.id, brokerName: "mt5" },
      {
        userID: req.user.id,
        brokerName: "mt5",
        login: parseInt(login),
        passwordHash: encrypt(password),
        server,
        isVerified: true,
        lastVerified: new Date(),
      },
      { upsert: true, new: true }
    );

    logger.info({
      message: "MT5 account setup successful",
      userId: req.user.id,
      login,
      correlationId: req.correlationId,
    });

    res.json({
      success: true,
      message: "MT5 account connected successfully",
      accountInfo: {
        login,
        server,
        balance: verifyResult.balance,
        equity: verifyResult.equity,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function setupOandaAccount(req, res, next) {
  try {
    const { apiKey, accountId, environment = "practice" } = req.body;

    if (!apiKey || !accountId) {
      throw new ValidationError("OANDA API key and account ID are required");
    }

    const verifyResult = await proxyRequest("trading", "POST", "/broker/verify/oanda", {
      apiKey,
      accountId,
      environment,
    }, req.correlationId);

    if (!verifyResult.success) {
      return res.status(400).json({
        error: "Failed to connect to OANDA account",
        details: verifyResult.error,
      });
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
    const { apiKey, secretKey, isTestnet = true } = req.body;

    if (!apiKey || !secretKey) {
      throw new ValidationError("Binance API key and secret key are required");
    }

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
      return res.status(400).json({
        error: "Failed to connect to Binance account",
        details: verifyResult.error,
      });
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
    const { brokerType } = req.params;

    const account = await BrokerAccount.findOne({
      userID: req.user.id,
      brokerName: brokerType,
    });

    if (!account) {
      return res.status(404).json({ error: `${brokerType} account not configured` });
    }

    let verifyResult;

    if (brokerType === "mt5") {
      const password = decrypt(account.passwordHash);
      if (!password) return res.status(500).json({ error: "Failed to decrypt MT5 credentials" });
      verifyResult = await proxyRequest("trading", "POST", "/broker/verify/mt5", {
        login: account.login,
        password,
        server: account.server,
      }, req.correlationId);
    } else if (brokerType === "oanda") {
      const apiKey = decrypt(account.apiKey);
      if (!apiKey) return res.status(500).json({ error: "Failed to decrypt OANDA credentials" });
      verifyResult = await proxyRequest("trading", "POST", "/broker/verify/oanda", {
        apiKey,
        accountId: account.accountId,
        environment: account.environment,
      }, req.correlationId);
    } else if (brokerType === "binance") {
      const apiKey = decrypt(account.apiKey);
      const secretKey = decrypt(account.secretKey);
      if (!apiKey || !secretKey) {
        return res.status(500).json({ error: "Failed to decrypt Binance credentials" });
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
    const accounts = await BrokerAccount.find({ userID: req.user.id }).select(
      "-passwordHash -apiKey -secretKey"
    );

    const result = {};
    for (const acct of accounts) {
      result[acct.brokerName] = {
        brokerName: acct.brokerName,
        isVerified: acct.isVerified,
        lastVerified: acct.lastVerified,
        ...(acct.brokerName === "mt5" && { login: acct.login, server: acct.server }),
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
  setupMT5Account,
  setupOandaAccount,
  setupBinanceAccount,
  verifyBrokerConnection,
  getBrokerAccounts,
};
