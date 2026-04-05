const { verifyToken } = require("../utils/jwt");
const User = require("../models/User");
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
    req.user = { id: decoded.id, email: decoded.email, role: decoded.role };
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return next(new UnauthorizedError("Invalid or expired token"));
    }
    next(err);
  }
}

module.exports = { authenticate };
