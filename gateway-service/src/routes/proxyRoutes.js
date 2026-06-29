const { Router } = require("express");
const { authenticate } = require("../middleware/auth");
const { proxyRequest, checkServiceHealth } = require("../services/serviceProxy");
const {
  cleanObjectId,
  cleanSafeId,
  cleanSymbol,
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
} = require("../utils/requestValidation");

const router = Router();

// ── NLP ──────────────────────────────────────────────────────────────────────

router.post("/parse", authenticate, async (req, res, next) => {
  try {
    const body = validateParseRequest(req.body);
    const result = await proxyRequest("nlp", "POST", "/parse", body, req.correlationId);
    res.json(result);
  } catch (err) { next(err); }
});

router.post("/sentiment", authenticate, async (req, res, next) => {
  try {
    const body = validateSentimentRequest(req.body);
    const result = await proxyRequest("nlp", "POST", "/sentiment", body, req.correlationId);
    res.json(result);
  } catch (err) { next(err); }
});

router.post("/agent/guard/forex", authenticate, async (req, res, next) => {
  try {
    const body = validateForexGuardRequest(req.body);
    const result = await proxyRequest("agent", "POST", "/guard/forex", body, req.correlationId);
    res.json(result);
  } catch (err) { next(err); }
});

router.post("/agent/explain/trade", authenticate, async (req, res, next) => {
  try {
    const body = validateTradeExplanationRequest(req.body);
    const result = await proxyRequest("agent", "POST", "/explain/trade", body, req.correlationId);
    res.json(result);
  } catch (err) { next(err); }
});

/** Forex Factory calendar (NLP `ForexFactoryScraper`) — must be before `/news/:symbol`. */
router.get("/news/forex-calendar", authenticate, async (req, res, next) => {
  try {
    const result = await proxyRequest("nlp", "GET", "/news/forex-calendar", null, req.correlationId);
    res.json(result);
  } catch (err) { next(err); }
});

/** CoinTelegraph RSS (NLP `CoinTelegraphScraper`). */
router.get("/news/crypto", authenticate, async (req, res, next) => {
  try {
    const result = await proxyRequest("nlp", "GET", "/news/crypto", null, req.correlationId);
    res.json(result);
  } catch (err) { next(err); }
});

router.get("/news/:symbol", authenticate, async (req, res, next) => {
  try {
    const symbol = encodeURIComponent(cleanSymbol(req.params.symbol));
    const result = await proxyRequest("nlp", "GET", `/news/${symbol}`, null, req.correlationId);
    res.json(result);
  } catch (err) { next(err); }
});

// ── Market Data ───────────────────────────────────────────────────────────────

router.get("/data/candles/:symbol", authenticate, async (req, res, next) => {
  try {
    const input = validateMarketDataQuery(req.params, req.query, { includeTimeframe: true, includeCount: true });
    const qs = new URLSearchParams({
      market: input.market,
      timeframe: input.timeframe,
      count: String(input.count),
      user_id: req.user.id,
    }).toString();
    const result = await proxyRequest("trading", "GET", `/data/candles/${encodeURIComponent(input.symbol)}?${qs}`, null, req.correlationId);
    res.json(result);
  } catch (err) { next(err); }
});

router.get("/data/tick/:symbol", authenticate, async (req, res, next) => {
  try {
    const input = validateMarketDataQuery(req.params, req.query);
    const qs = new URLSearchParams({ market: input.market, user_id: req.user.id }).toString();
    const result = await proxyRequest("trading", "GET", `/data/tick/${encodeURIComponent(input.symbol)}?${qs}`, null, req.correlationId);
    res.json(result);
  } catch (err) { next(err); }
});

router.get("/data/account", authenticate, async (req, res, next) => {
  try {
    const market = validateMarketDataQuery({}, req.query, { symbolRequired: false }).market;
    const qs = new URLSearchParams({ market, user_id: req.user.id }).toString();
    const result = await proxyRequest("trading", "GET", `/data/account?${qs}`, null, req.correlationId);
    res.json(result);
  } catch (err) { next(err); }
});

router.get("/data/open-positions", authenticate, async (req, res, next) => {
  try {
    const market = validateMarketDataQuery({}, req.query, { symbolRequired: false }).market;
    const qs = new URLSearchParams({ market, user_id: req.user.id }).toString();
    const result = await proxyRequest("trading", "GET", `/data/open-positions?${qs}`, null, req.correlationId);
    res.json(result);
  } catch (err) { next(err); }
});

// ── Bots ─────────────────────────────────────────────────────────────────────

router.post("/bots/from-parse", authenticate, async (req, res, next) => {
  try {
    const body = { ...validateBotFromParse(req.body), user_id: req.user.id };
    const result = await proxyRequest("trading", "POST", "/bots/from-parse", body, req.correlationId);
    res.json(result);
  } catch (err) { next(err); }
});

router.get("/bots/types", authenticate, async (req, res, next) => {
  try {
    const result = await proxyRequest("trading", "GET", "/bots/types", null, req.correlationId);
    res.json(result);
  } catch (err) { next(err); }
});

router.post("/bots", authenticate, async (req, res, next) => {
  try {
    // Inject authenticated user_id so trading-service links bot to the right user
    const body = { ...validateBotCreate(req.body), user_id: req.user.id };
    const result = await proxyRequest("trading", "POST", "/bots/", body, req.correlationId);
    res.json(result);
  } catch (err) { next(err); }
});

router.get("/bots", authenticate, async (req, res, next) => {
  try {
    const qs = new URLSearchParams({ user_id: req.user.id }).toString();
    const result = await proxyRequest("trading", "GET", `/bots/?${qs}`, null, req.correlationId);
    res.json(result);
  } catch (err) { next(err); }
});

router.get("/bots/:botId", authenticate, async (req, res, next) => {
  try {
    const botId = cleanSafeId(req.params.botId, "botId");
    const result = await proxyRequest("trading", "GET", `/bots/${encodeURIComponent(botId)}`, null, req.correlationId);
    res.json(result);
  } catch (err) { next(err); }
});

router.patch("/bots/:botId/status", authenticate, async (req, res, next) => {
  try {
    const botId = cleanSafeId(req.params.botId, "botId");
    const body = validateBotStatus(req.body);
    const result = await proxyRequest("trading", "PATCH", `/bots/${encodeURIComponent(botId)}/status`, body, req.correlationId);
    res.json(result);
  } catch (err) { next(err); }
});

router.delete("/bots/:botId", authenticate, async (req, res, next) => {
  try {
    const botId = cleanSafeId(req.params.botId, "botId");
    const qs = new URLSearchParams({ user_id: req.user.id }).toString();
    const result = await proxyRequest("trading", "DELETE", `/bots/${encodeURIComponent(botId)}?${qs}`, null, req.correlationId);
    res.json(result);
  } catch (err) { next(err); }
});

router.post("/bots/:botId/rollback", authenticate, async (req, res, next) => {
  try {
    const botId = cleanSafeId(req.params.botId, "botId");
    const result = await proxyRequest("trading", "POST", `/bots/${encodeURIComponent(botId)}/rollback`, null, req.correlationId);
    res.json(result);
  } catch (err) { next(err); }
});

/** One-shot execution cycle for all active bots (sentiment gate + broker). Trading-service `POST /debug/execute`. */
router.post("/trading/debug/execute", authenticate, async (req, res, next) => {
  try {
    const result = await proxyRequest("trading", "POST", "/debug/execute", {}, req.correlationId);
    res.json(result);
  } catch (err) { next(err); }
});

/** One-shot real OANDA practice test trade for the user's active forex bot. */
router.post("/trading/debug/test-oanda-execute", authenticate, async (req, res, next) => {
  try {
    const result = await proxyRequest(
      "trading",
      "POST",
      "/debug/test-oanda-execute",
      { user_id: req.user.id },
      req.correlationId
    );
    res.json(result);
  } catch (err) { next(err); }
});

// ── Trades ────────────────────────────────────────────────────────────────────

router.get("/trades", authenticate, async (req, res, next) => {
  try {
    const input = validateTradesQuery(req.query);
    const qs = new URLSearchParams({ ...input, user_id: req.user.id }).toString();
    const result = await proxyRequest("trading", "GET", `/trades?${qs}`, null, req.correlationId);
    res.json(result);
  } catch (err) { next(err); }
});

// ── Backtest ──────────────────────────────────────────────────────────────────

/** Script-style backtest (flat path — avoids 404 on older gateways where nested `/backtest/script-run` was missing). */
const scriptBacktestHandler = async (req, res, next) => {
  try {
    const body = validateScriptBacktestBody(req.body);
    const result = await proxyRequest(
      "trading",
      "POST",
      "/backtest/script-run",
      { ...body, user_id: req.user.id },
      req.correlationId
    );
    res.json(result);
  } catch (err) { next(err); }
};
router.post("/backtest-script-run", authenticate, scriptBacktestHandler);

/** Fetch candles on the trading service, then run backtest — one round trip from the client. */
router.post("/backtest/run", authenticate, async (req, res, next) => {
  try {
    const { bot_type, symbol, market, timeframe, parameters, count } = validateBacktestRunBody(req.body);
    const qs = new URLSearchParams({
      market,
      timeframe,
      count: String(count),
    }).toString();
    const enc = encodeURIComponent(symbol);
    const candlesPayload = await proxyRequest(
      "trading",
      "GET",
      `/data/candles/${enc}?${qs}`,
      null,
      req.correlationId
    );
    const backtestPayload = await proxyRequest(
      "trading",
      "POST",
      "/backtest",
      {
        bot_type,
        symbol,
        market,
        timeframe,
        parameters: parameters && typeof parameters === "object" ? parameters : {},
        candles: candlesPayload.candles,
      },
      req.correlationId
    );
    res.json({ candles: candlesPayload, backtest: backtestPayload });
  } catch (err) {
    next(err);
  }
});

/** One-shot real Binance demo/live test trade for the user's active crypto bot. */
router.post("/trading/debug/test-binance-execute", authenticate, async (req, res, next) => {
  try {
    const result = await proxyRequest(
      "trading",
      "POST",
      "/debug/test-binance-execute",
      { user_id: req.user.id },
      req.correlationId
    );
    res.json(result);
  } catch (err) { next(err); }
});

router.post("/backtest", authenticate, async (req, res, next) => {
  try {
    const body = validateBacktestBody(req.body);
    const result = await proxyRequest("trading", "POST", "/backtest", body, req.correlationId);
    res.json(result);
  } catch (err) { next(err); }
});

/** Long-range script backtest — alias (same handler as `/backtest-script-run`). */
router.post("/backtest/script-run", authenticate, scriptBacktestHandler);

router.get("/backtest/reports", authenticate, async (req, res, next) => {
  try {
    const qs = new URLSearchParams(validateReportsQuery(req.query)).toString();
    const result = await proxyRequest("trading", "GET", `/backtest/reports?${qs}`, null, req.correlationId);
    res.json(result);
  } catch (err) { next(err); }
});

router.get("/backtest/reports/:reportId", authenticate, async (req, res, next) => {
  try {
    const reportId = cleanObjectId(req.params.reportId, "reportId");
    const result = await proxyRequest("trading", "GET", `/backtest/reports/${encodeURIComponent(reportId)}`, null, req.correlationId);
    res.json(result);
  } catch (err) { next(err); }
});

// ── Health ────────────────────────────────────────────────────────────────────

router.get("/services/health", authenticate, async (_req, res) => {
  const [nlp, trading, agent] = await Promise.all([
    checkServiceHealth("nlp"),
    checkServiceHealth("trading"),
    checkServiceHealth("agent"),
  ]);
  res.json({ services: [nlp, trading, agent] });
});

module.exports = router;
