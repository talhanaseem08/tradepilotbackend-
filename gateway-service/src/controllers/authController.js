const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/User");
const { signToken } = require("../utils/jwt");
const { ValidationError, UnauthorizedError } = require("../utils/errors");
const logger = require("../utils/logger");

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

module.exports = { register, login };
