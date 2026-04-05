const mongoose = require("mongoose");
const config = require("./index");
const logger = require("../utils/logger");

async function connectDB() {
  try {
    await mongoose.connect(config.mongo.uri);
    logger.info("MongoDB connected");
  } catch (err) {
    logger.error({ message: "MongoDB connection failed", error: err.message });
    process.exit(1);
  }
}

module.exports = connectDB;
