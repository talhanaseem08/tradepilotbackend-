const { Router } = require("express");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { authenticate } = require("../middleware/auth");
const User = require("../models/User");
const { ValidationError } = require("../utils/errors");

const router = Router();

// GET /api/users/me
router.get("/me", authenticate, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user });
  } catch (err) { next(err); }
});

// PUT /api/users/me  — update email or password
router.put("/me", authenticate, async (req, res, next) => {
  try {
    const { email, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const updates = {};

    if (email) {
      updates.email = email.toLowerCase().trim();
    }

    if (newPassword) {
      if (!currentPassword) throw new ValidationError("currentPassword required to set a new password");
      const valid = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!valid) throw new ValidationError("Current password is incorrect");
      updates.passwordHash = await bcrypt.hash(newPassword, 12);
    }

    const updated = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select("-passwordHash");
    res.json({ user: updated });
  } catch (err) { next(err); }
});

// POST /api/users/api-key  — generate or rotate API key
router.post("/api-key", authenticate, async (req, res, next) => {
  try {
    const apiKey = crypto.randomBytes(32).toString("hex");
    await User.findByIdAndUpdate(req.user.id, { apiKey });
    res.json({ apiKey });
  } catch (err) { next(err); }
});

module.exports = router;
