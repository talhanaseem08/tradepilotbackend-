const { Router } = require("express");
const {
  register,
  login,
  googleLogin,
  forgotPassword,
  resetPassword,
  getAppEntryStatus,
  completeOnboarding,
} = require("../controllers/authController");
const { authenticate } = require("../middleware/auth");

const router = Router();

/** GET — quick check that this gateway has auth routes (useful after deploy). */
router.get("/health", (_req, res) => {
  res.json({ ok: true, service: "gateway-auth" });
});

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleLogin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/app-entry", authenticate, getAppEntryStatus);
router.post("/onboarding/complete", authenticate, completeOnboarding);

module.exports = router;
