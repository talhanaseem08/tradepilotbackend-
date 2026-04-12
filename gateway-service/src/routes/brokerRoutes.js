const { Router } = require("express");
const { authenticate } = require("../middleware/auth");
const { 
  setupMT5Account, 
  setupOandaAccount, 
  verifyBrokerConnection,
  getBrokerAccounts 
} = require("../controllers/brokerController");

const router = Router();

// Get user's broker accounts
router.get("/accounts", authenticate, getBrokerAccounts);

// Setup MT5 account
router.post("/mt5/setup", authenticate, setupMT5Account);

// Setup OANDA account  
router.post("/oanda/setup", authenticate, setupOandaAccount);

// Verify broker connection
router.post("/verify/:brokerType", authenticate, verifyBrokerConnection);

module.exports = router;