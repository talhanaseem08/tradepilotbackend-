const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/User");
const { signToken } = require("../utils/jwt");
const { AppError, ValidationError, UnauthorizedError } = require("../utils/errors");
const logger = require("../utils/logger");
const { sendPasswordResetEmail } = require("../services/email");

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

async function register(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new ValidationError("Email and password are required");
    }

    const existing = await User.findOne({ email });
    if (existing) {
      throw new ValidationError("Email already registered");
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const apiKey = `tp_${uuidv4().replace(/-/g, "")}`;

    const user = await User.create({ email, passwordHash, apiKey });
    const token = signToken({ id: user._id, email: user.email, role: user.role });

    logger.info({ message: "User registered", email, correlationId: req.correlationId });

    res.status(201).json({
      token,
      apiKey,
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new ValidationError("Email and password are required");
    }

    const user = await User.findOne({ email });
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

    const token = signToken({ id: user._id, email: user.email, role: user.role });

    logger.info({ message: "User logged in", email, correlationId: req.correlationId });

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
      throw new ValidationError("Google sign-in is not configured (GOOGLE_CLIENT_ID)");
    }

    const googleOAuthClient = new OAuth2Client(googleClientId);

    let { idToken } = req.body;
    if (!idToken || typeof idToken !== "string") {
      throw new ValidationError("idToken is required");
    }
    idToken = idToken.trim();

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
      throw new UnauthorizedError(
        "Google sign-in could not be verified. Use the same Web client ID in GOOGLE_CLIENT_ID as in VITE_GOOGLE_CLIENT_ID (no extra spaces or quotes)."
      );
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

    const token = signToken({ id: user._id, email: user.email, role: user.role });

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

const RESET_TOKEN_BYTES = 32;
const RESET_EXPIRY_MS = 60 * 60 * 1000;

function hashResetToken(rawToken) {
  return crypto.createHash("sha256").update(rawToken, "utf8").digest("hex");
}

function getFrontendBaseUrl() {
  const raw = process.env.FRONTEND_URL || "http://localhost:5173";
  return typeof raw === "string" ? raw.replace(/\/$/, "") : "http://localhost:5173";
}

/** Shown in API + UI when mail is not wired (dev). Same for all outcomes — does not reveal if the address exists. */
function forgotPasswordDevHint() {
  if (process.env.NODE_ENV === "production") return undefined;
  const h = process.env.SMTP_HOST;
  if (h && typeof h === "string" && h.trim()) return undefined;
  return "No email was sent: SMTP is not configured on the gateway. Add SMTP_* to .env (see gateway .env.example), or copy the reset link from the gateway logs when testing locally.";
}

/**
 * Same response whether or not the email exists (avoid account enumeration).
 */
async function forgotPassword(req, res, next) {
  const genericMessage =
    "If an account exists for that email, a reset link has been sent.";
  const hint = forgotPasswordDevHint();

  try {
    const emailRaw = req.body && req.body.email;
    const email =
      typeof emailRaw === "string" ? emailRaw.toLowerCase().trim() : "";
    if (!email) {
      throw new ValidationError("Email is required");
    }

    const user = await User.findOne({ email });

    if (!user || !user.passwordHash) {
      logger.info({
        message: "Forgot password: no local-password account",
        email,
        correlationId: req.correlationId,
      });
      return res.json({
        message: genericMessage,
        ...(hint ? { devHint: hint } : {}),
      });
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
          "Unable to send reset email. Check SMTP settings or try again later.",
          503
        )
      );
    }

    logger.info({
      message: "Password reset requested",
      email,
      correlationId: req.correlationId,
    });

    res.json({
      message: genericMessage,
      ...(hint ? { devHint: hint } : {}),
    });
  } catch (err) {
    next(err);
  }
}

async function resetPassword(req, res, next) {
  try {
    const tokenRaw = req.body && req.body.token;
    const password = req.body && req.body.password;
    const token = typeof tokenRaw === "string" ? tokenRaw.trim() : "";
    if (!token || !password) {
      throw new ValidationError("Token and password are required");
    }
    if (typeof password !== "string" || password.length < 8) {
      throw new ValidationError("Password must be at least 8 characters");
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

module.exports = { register, login, googleLogin, forgotPassword, resetPassword };
