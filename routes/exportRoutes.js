const express = require("express");
const router = express.Router();
const StockTransaction = require("../model/model");
const StockCapital = require("../model/stockModel");
const CoinCapital = require("../model/coinModel");
const SipCapital = require("../model/sipModel");
const SsfCapital = require("../model/ssfModel");

/**
 * @route   GET /api/export
 * @desc    Every document of every collection, as stored. Keys match MoneyMgr v2's investment import sources,
 *          so the moneyMgr frontend can put this straight into the backup file v2 restores from.
 * @access  Public
 */
router.get("/export", async (req, res) => {
  try {
    const [stockTransactions, stockCapital, coinCapital, sipCapital, ssfCapital] = await Promise.all([
      StockTransaction.find().sort({ investedDate: 1 }).lean(),
      StockCapital.find().sort({ date: 1 }).lean(),
      CoinCapital.find().sort({ date: 1 }).lean(),
      SipCapital.find().sort({ date: 1 }).lean(),
      SsfCapital.find().sort({ paidDate: 1 }).lean(),
    ]);
    res.set("Cache-Control", "no-store");
    return res.status(200).json({
      success: true,
      data: {
        exportedAt: new Date().toISOString(),
        "stock-transactions": stockTransactions,
        "stock-capital": stockCapital,
        "coin-capital": coinCapital,
        "sip-capital": sipCapital,
        "ssf-capital": ssfCapital,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to export data", error: error.message });
  }
});

module.exports = router;
