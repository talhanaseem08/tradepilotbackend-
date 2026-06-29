const { Router } = require("express");
const rateLimit = require("express-rate-limit");
const {
  register,
  login,
  googleLogin,
  forgotPassword,
  resetPassword,
  getAppEntryStatus,
  completeOnboarding,
  logout,
} = require("../controllers/authController");
const { authenticate } = require("../middleware/auth");

const router = Router();

const authAttemptLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: "Too many auth attempts, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

/** GET — quick check that this gateway has auth routes (useful after deploy). */
router.get("/health", (_req, res) => {
  res.json({ ok: true, service: "gateway-auth" });
});

router.post("/register", authAttemptLimiter, register);
router.post("/login", authAttemptLimiter, login);
router.post("/google", authAttemptLimiter, googleLogin);
router.post("/forgot-password", authAttemptLimiter, forgotPassword);
router.post("/reset-password", authAttemptLimiter, resetPassword);
router.get("/app-entry", authenticate, getAppEntryStatus);
router.post("/onboarding/complete", authenticate, completeOnboarding);
router.post("/logout", authenticate, logout);

module.exports = router;
