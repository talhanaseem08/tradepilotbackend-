const mongoose = require("mongoose");

const brokerAccountSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    brokerName: {
      type: String,
      enum: ["mt5", "oanda", "binance"],
      required: true,
    },
    // Generic diagram fields
    apiKey: { type: String, default: null },     // OANDA apiKey / Binance apiKey (encrypted)
    secretKey: { type: String, default: null },  // Binance apiSecret (encrypted)

    // MT5-specific
    login: { type: Number, default: null },
    passwordHash: { type: String, default: null },
    server: { type: String, default: null },

    // OANDA-specific
    accountId: { type: String, default: null },
    environment: {
      type: String,
      enum: ["practice", "live"],
      default: "practice",
    },

    // Binance-specific
    isTestnet: { type: Boolean, default: true },

    isVerified: { type: Boolean, default: false },
    lastVerified: { type: Date, default: null },
  },
  { timestamps: true }
);

// One account per broker per user
brokerAccountSchema.index({ userID: 1, brokerName: 1 }, { unique: true });

module.exports = mongoose.model("BrokerAccount", brokerAccountSchema);
