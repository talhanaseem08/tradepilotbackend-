const { Router } = require("express");
const {
  register,
  login,
  googleLogin,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

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

module.exports = router;
