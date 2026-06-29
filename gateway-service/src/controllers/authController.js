const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/User");
const { signToken } = require("../utils/jwt");
const { AppError, ValidationError, UnauthorizedError } = require("../utils/errors");
const logger = require("../utils/logger");
const { sendPasswordResetEmail } = require("../services/email");
const { proxyRequest } = require("../services/serviceProxy");
const {
  getEmailValidationError,
  getPasswordValidationError,
  normalizeEmail,
} = require("../utils/authValidation");
const {
  cleanString,
  rejectUnknownFields,
  requirePlainObject,
} = require("../utils/requestValidation");

/** Trim and strip wrapping quotes — mismatched audience breaks verifyIdToken. */
function normalizeGoogleClientId(raw) {
  if (raw == null || typeof raw !== "string") return null;
  let s = raw.trim();
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    s = s.slice(1, -1).trim();
  }
  return s.length ? s : null;
}

async function issueSessionForUser(user) {
  const sessionId = uuidv4().replace(/-/g, "");
  const now = new Date();

  user.activeSessionId = sessionId;
  user.activeSessionStartedAt = now;
  user.sessionLastSeenAt = now;
  await user.save();

  return signToken({
    id: user._id,
    email: user.email,
    role: user.role,
    sid: sessionId,
  });
}

async function register(req, res, next) {
  try {
    const body = requirePlainObject(req.body);
    rejectUnknownFields(body, ["email", "password"]);
    const { email, password } = body;
    if (!email || !password) {
      throw new ValidationError("Email and password are required");
    }

    const emailError = getEmailValidationError(email);
    if (emailError) {
      throw new ValidationError(emailError);
    }
    const normalizedEmail = normalizeEmail(email);

    const passwordError = getPasswordValidationError(password);
    if (passwordError) {
      throw new ValidationError(passwordError);
    }

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      throw new ValidationError("Email already registered");
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const apiKey = `tp_${uuidv4().replace(/-/g, "")}`;

    const user = await User.create({ email: normalizedEmail, passwordHash, apiKey });
    const token = await issueSessionForUser(user);

    logger.info({
      message: "User registered",
      email: normalizedEmail,
      correlationId: req.correlationId,
    });

    res.status(201).json({
      token,
      apiKey,
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
}

async function getBotCountForUser(userId, correlationId) {
  try {
    const result = await proxyRequest(
      "trading",
      "GET",
      `/bots/?user_id=${encodeURIComponent(String(userId))}`,
      null,
      correlationId
    );
    if (Array.isArray(result)) {
      return result.length;
    }
    if (result && typeof result === "object") {
      if (typeof result.count === "number") {
        return result.count;
      }
      if (Array.isArray(result.bots)) {
        return result.bots.length;
      }
    }
    return 0;
  } catch (err) {
    logger.warn({
      message: "Could not fetch bot count for app entry status",
      userId: String(userId),
      error: err.message,
      correlationId,
    });
    return 0;
  }
}

function resolveNextPath({ onboardingCompleted, botCount }) {
  if (botCount > 0) return "/dashboard";
  if (onboardingCompleted) return "/prompt";
  return "/welcome";
}

async function login(req, res, next) {
  try {
    const body = requirePlainObject(req.body);
    rejectUnknownFields(body, ["email", "password"]);
    const { email, password } = body;
    if (!email || !password) {
      throw new ValidationError("Email and password are required");
    }

    const emailError = getEmailValidationError(email);
    if (emailError) {
      throw new ValidationError(emailError);
    }
    const normalizedEmail = normalizeEmail(email);

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      throw new UnauthorizedError("Invalid credentials");
    }

    if (!user.passwordHash) {
      throw new UnauthorizedError("This account uses Google sign-in");
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const token = await issueSessionForUser(user);

    logger.info({
      message: "User logged in",
      email: normalizedEmail,
      correlationId: req.correlationId,
    });

    res.json({
      token,
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
}

async function googleLogin(req, res, next) {
  try {
    const googleClientId = normalizeGoogleClientId(process.env.GOOGLE_CLIENT_ID);
    if (!googleClientId) {
      logger.error({
        message: "Google sign-in is not configured",
        missing: "GOOGLE_CLIENT_ID",
        correlationId: req.correlationId,
      });
      throw new AppError("Google sign-in is temporarily unavailable. Please try again later.", 503);
    }

    const googleOAuthClient = new OAuth2Client(googleClientId);

    const body = requirePlainObject(req.body);
    rejectUnknownFields(body, ["idToken"]);
    const idToken = cleanString(body.idToken, "idToken", { required: true, max: 4096 });

    let ticket;
    try {
      ticket = await googleOAuthClient.verifyIdToken({
        idToken,
        audience: googleClientId,
      });
    } catch (verifyErr) {
      logger.warn({
        message: "Google verifyIdToken failed",
        err: verifyErr.message,
        correlationId: req.correlationId,
      });
      throw new UnauthorizedError("Google sign-in could not be verified. Please try again.");
    }

    const payload = ticket.getPayload();
    const email = (payload.email || "").toLowerCase().trim();
    const sub = payload.sub;
    const emailVerified = payload.email_verified;

    if (!email || !sub) {
      throw new UnauthorizedError("Invalid Google token");
    }
    if (emailVerified === false) {
      throw new UnauthorizedError("Google email is not verified");
    }

    let user = await User.findOne({
      $or: [{ googleSub: sub }, { email }],
    });

    if (!user) {
      const apiKey = `tp_${uuidv4().replace(/-/g, "")}`;
      try {
        user = await User.create({
          email,
          googleSub: sub,
          apiKey,
        });
      } catch (createErr) {
        if (createErr.code === 11000) {
          user = await User.findOne({
            $or: [{ googleSub: sub }, { email }],
          });
        }
        if (!user) {
          throw createErr;
        }
      }
    } else {
      if (!user.googleSub) {
        user.googleSub = sub;
        await user.save();
      }
    }

    const token = await issueSessionForUser(user);

    logger.info({
      message: "User logged in with Google",
      email,
      correlationId: req.correlationId,
    });

    res.json({
      token,
      user: {
        id: String(user._id),
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function getAppEntryStatus(req, res, next) {
  try {
    const user = await User.findById(req.user.id).select(
      "email role onboardingCompleted onboardingCompletedAt"
    );
    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    const botCount = await getBotCountForUser(user._id, req.correlationId);
    const onboardingCompleted = !!user.onboardingCompleted;
    const nextPath = resolveNextPath({ onboardingCompleted, botCount });

    res.json({
      onboardingCompleted,
      onboardingCompletedAt: user.onboardingCompletedAt,
      botCount,
      nextPath,
      user: {
        id: String(user._id),
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function completeOnboarding(req, res, next) {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        onboardingCompleted: true,
        onboardingCompletedAt: new Date(),
      },
      { new: true }
    ).select("email role onboardingCompleted onboardingCompletedAt");

    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    const botCount = await getBotCountForUser(user._id, req.correlationId);
    const nextPath = resolveNextPath({
      onboardingCompleted: true,
      botCount,
    });

    logger.info({
      message: "User completed onboarding",
      userId: String(user._id),
      correlationId: req.correlationId,
    });

    res.json({
      onboardingCompleted: true,
      onboardingCompletedAt: user.onboardingCompletedAt,
      botCount,
      nextPath,
    });
  } catch (err) {
    next(err);
  }
}

async function logout(req, res, next) {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      $set: {
        activeSessionId: null,
        activeSessionStartedAt: null,
        sessionLastSeenAt: null,
      },
    });

    logger.info({
      message: "User logged out",
      userId: String(req.user.id),
      correlationId: req.correlationId,
    });

    res.json({ message: "Logged out successfully." });
  } catch (err) {
    next(err);
  }
}

const RESET_TOKEN_BYTES = 32;
const RESET_EXPIRY_MS = 60 * 60 * 1000;

function hashResetToken(rawToken) {
  return crypto.createHash("sha256").update(rawToken, "utf8").digest("hex");
}

function getFrontendBaseUrl() {
  const raw = process.env.FRONTEND_URL || "http://localhost:5173";
  return typeof raw === "string" ? raw.replace(/\/$/, "") : "http://localhost:5173";
}

/**
 * Same response whether or not the email exists (avoid account enumeration).
 */
async function forgotPassword(req, res, next) {
  const genericMessage =
    "If an account exists for that email, a reset link has been sent.";

  try {
    const body = requirePlainObject(req.body);
    rejectUnknownFields(body, ["email"]);
    const emailRaw = body.email;
    const emailError = getEmailValidationError(emailRaw);
    if (emailError) {
      throw new ValidationError(emailError);
    }
    const email = normalizeEmail(emailRaw);

    const user = await User.findOne({ email });

    if (!user || !user.passwordHash) {
      logger.info({
        message: "Forgot password: no local-password account",
        email,
        correlationId: req.correlationId,
      });
      return res.json({ message: genericMessage });
    }

    const rawToken = crypto.randomBytes(RESET_TOKEN_BYTES).toString("hex");
    const tokenHash = hashResetToken(rawToken);

    user.passwordResetTokenHash = tokenHash;
    user.passwordResetExpires = new Date(Date.now() + RESET_EXPIRY_MS);
    await user.save();

    const resetUrl = `${getFrontendBaseUrl()}/auth/reset-password?token=${encodeURIComponent(rawToken)}`;

    try {
      await sendPasswordResetEmail({ to: email, resetUrl });
    } catch (mailErr) {
      logger.error({
        message: "Failed to send password reset email",
        err: mailErr.message,
        correlationId: req.correlationId,
      });
      user.passwordResetTokenHash = null;
      user.passwordResetExpires = null;
      await user.save();
      return next(
        new AppError(
          "We could not send the reset email right now. Please try again later.",
          503
        )
      );
    }

    logger.info({
      message: "Password reset requested",
      email,
      correlationId: req.correlationId,
    });

    res.json({ message: genericMessage });
  } catch (err) {
    next(err);
  }
}

async function resetPassword(req, res, next) {
  try {
    const body = requirePlainObject(req.body);
    rejectUnknownFields(body, ["token", "password"]);
    const token = cleanString(body.token, "token", {
      required: true,
      max: 64,
      pattern: /^[a-f0-9]{64}$/i,
    });
    const password = body.password;
    if (!password) throw new ValidationError("Token and password are required");
    const passwordError = getPasswordValidationError(password);
    if (passwordError) {
      throw new ValidationError(passwordError);
    }

    const tokenHash = hashResetToken(token);
    const user = await User.findOne({
      passwordResetTokenHash: tokenHash,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new ValidationError("Invalid or expired reset link. Request a new one.");
    }

    user.passwordHash = await bcrypt.hash(password, 12);
    user.passwordResetTokenHash = null;
    user.passwordResetExpires = null;
    await user.save();

    logger.info({
      message: "Password reset completed",
      email: user.email,
      correlationId: req.correlationId,
    });

    res.json({ message: "Password updated. You can sign in now." });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
  googleLogin,
  forgotPassword,
  resetPassword,
  getAppEntryStatus,
  completeOnboarding,
  logout,
};
