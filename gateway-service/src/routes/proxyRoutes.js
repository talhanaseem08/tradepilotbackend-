const { Router } = require("express");
const { authenticate } = require("../middleware/auth");
const { proxyRequest, checkServiceHealth } = require("../services/serviceProxy");

const router = Router();

router.post("/parse", authenticate, async (req, res, next) => {
  try {
    const result = await proxyRequest("nlp", "POST", "/parse", req.body, req.correlationId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.post("/sentiment", authenticate, async (req, res, next) => {
  try {
    const result = await proxyRequest("nlp", "POST", "/sentiment", req.body, req.correlationId);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get("/services/health", authenticate, async (_req, res) => {
  const [nlp, trading, agent] = await Promise.all([
    checkServiceHealth("nlp"),
    checkServiceHealth("trading"),
    checkServiceHealth("agent"),
  ]);
  res.json({ services: [nlp, trading, agent] });
});

module.exports = router;
