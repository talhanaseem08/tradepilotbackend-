const { verifyToken } = require("../utils/jwt");
const User = require("../models/User");
const config = require("../config");
const { UnauthorizedError } = require("../utils/errors");

async function authenticate(req, _res, next) {
  try {
    const apiKey = req.headers["x-api-key"];
    if (apiKey) {
      const user = await User.findOne({ apiKey });
      if (!user) throw new UnauthorizedError("Invalid API key");
      req.user = { id: user._id, email: user.email, role: user.role };
      return next();
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("No token provided");
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select(
      "email role activeSessionId sessionLastSeenAt"
    );
    if (!user) {
      throw new UnauthorizedError("User not found");
    }
    if (!decoded.sid || user.activeSessionId !== decoded.sid) {
      throw new UnauthorizedError("Session is no longer active");
    }

    const now = new Date();
    const idleTimeoutMs = config.jwt.idleTimeoutMinutes * 60 * 1000;
    const lastSeen = user.sessionLastSeenAt instanceof Date ? user.sessionLastSeenAt : null;
    if (lastSeen && now.getTime() - lastSeen.getTime() > idleTimeoutMs) {
      await User.findByIdAndUpdate(user._id, {
        $set: {
          activeSessionId: null,
          activeSessionStartedAt: null,
          sessionLastSeenAt: null,
        },
      });
      throw new UnauthorizedError("Session expired due to inactivity");
    }

    const refreshWindowMs = config.jwt.activityRefreshSeconds * 1000;
    if (!lastSeen || now.getTime() - lastSeen.getTime() >= refreshWindowMs) {
      await User.findByIdAndUpdate(user._id, {
        $set: { sessionLastSeenAt: now },
      });
    }

    req.user = {
      id: user._id,
      email: user.email,
      role: user.role,
      sessionId: decoded.sid,
    };
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return next(new UnauthorizedError("Invalid or expired token"));
    }
    next(err);
  }
}

module.exports = { authenticate };
