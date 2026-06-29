const { Router } = require("express");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { authenticate } = require("../middleware/auth");
const User = require("../models/User");
const { ValidationError } = require("../utils/errors");
const {
  getEmailValidationError,
  getPasswordValidationError,
  normalizeEmail,
} = require("../utils/authValidation");
const {
  rejectUnknownFields,
  requirePlainObject,
} = require("../utils/requestValidation");

const router = Router();

router.get("/me", authenticate, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select(
      "email role apiKey createdAt updatedAt"
    );

    if (!user) {
      throw new ValidationError("User not found");
    }

    res.json({
      user: {
        id: String(req.user.id),
        email: user.email,
        role: user.role,
        apiKey: user.apiKey || null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.put("/me", authenticate, async (req, res, next) => {
  try {
    const body = requirePlainObject(req.body);
    rejectUnknownFields(body, ["email", "password"]);
    const { email, password } = body;
    const updates = {};

    if (email != null) {
      const emailError = getEmailValidationError(email);
      if (emailError) {
        throw new ValidationError(emailError);
      }
      const normalizedEmail = normalizeEmail(email);

      const existing = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: req.user.id },
      });
      if (existing) {
        throw new ValidationError("Email already in use");
      }

      updates.email = normalizedEmail;
    }

    if (password != null) {
      const passwordError = getPasswordValidationError(password);
      if (passwordError) {
        throw new ValidationError(passwordError);
      }
      updates.passwordHash = await bcrypt.hash(password, 12);
    }

    if (Object.keys(updates).length === 0) {
      throw new ValidationError("No profile changes provided");
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("email role apiKey createdAt updatedAt");

    res.json({
      message: "Profile updated",
      user: {
        id: String(req.user.id),
        email: user.email,
        role: user.role,
        apiKey: user.apiKey || null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.post("/api-key", authenticate, async (req, res, next) => {
  try {
    const apiKey = `tp_${crypto.randomBytes(24).toString("hex")}`;

    await User.findByIdAndUpdate(req.user.id, {
      $set: { apiKey },
    });

    res.json({
      message: "API key rotated",
      apiKey,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
