const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: false,
    },
    /** Google `sub` claim — set when user signs in with Google (no password). */
    googleSub: {
      type: String,
      sparse: true,
      unique: true,
    },
    apiKey: {
      type: String,
      unique: true,
      sparse: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    /** SHA-256 hex of raw reset token (never store the raw token). */
    passwordResetTokenHash: {
      type: String,
      default: null,
    },
    passwordResetExpires: {
      type: Date,
      default: null,
    },
    onboardingCompleted: {
      type: Boolean,
      default: false,
    },
    onboardingCompletedAt: {
      type: Date,
      default: null,
    },
    activeSessionId: {
      type: String,
      default: null,
    },
    activeSessionStartedAt: {
      type: Date,
      default: null,
    },
    sessionLastSeenAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
