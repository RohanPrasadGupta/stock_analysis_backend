const express = require("express");
const router = express.Router();
const {
  createCoinCapital,
  getAllCoinCapitals,
  getCoinCapitalById,
  updateCoinCapital,
  deleteCoinCapital,
  getCoinCapitalSummary,
} = require("../services/coinCapitalService");

/**
 * @route   POST /api/coin-capital
 * @desc    Create a new coin capital record
 * @access  Public
 * @body    { date: "2022-01-20", amount: 30000, transactionCharge: 300, totalAmount: 30300 }
 */
router.post("/coin-capital", async (req, res) => {
  try {
    const result = await createCoinCapital(req.body);
    
    if (result.success) {
      return res.status(201).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/coin-capital
 * @desc    Get all coin capital records with optional filters
 * @query   startDate, endDate
 * @access  Public
 */
router.get("/coin-capital", async (req, res) => {
  try {
    const filters = {
      startDate: req.query.startDate,
      endDate: req.query.endDate,
    };

    const result = await getAllCoinCapitals(filters);
    
    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/coin-capital/:id
 * @desc    Get a single coin capital record by ID
 * @access  Public
 */
router.get("/coin-capital/:id", async (req, res) => {
  try {
    const result = await getCoinCapitalById(req.params.id);
    
    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

/**
 * @route   PUT /api/coin-capital/:id
 * @desc    Update a coin capital record
 * @access  Public
 * @body    { date: "2022-01-20", amount: 35000, transactionCharge: 350, totalAmount: 35350 }
 */
router.put("/coin-capital/:id", async (req, res) => {
  try {
    const result = await updateCoinCapital(req.params.id, req.body);
    
    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

/**
 * @route   PATCH /api/coin-capital/:id
 * @desc    Partially update a coin capital record
 * @access  Public
 * @body    { amount: 35000 }
 */
router.patch("/coin-capital/:id", async (req, res) => {
  try {
    const result = await updateCoinCapital(req.params.id, req.body);
    
    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

/**
 * @route   DELETE /api/coin-capital/:id
 * @desc    Delete a coin capital record
 * @access  Public
 */
router.delete("/coin-capital/:id", async (req, res) => {
  try {
    const result = await deleteCoinCapital(req.params.id);
    
    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/coin-capital/summary/total
 * @desc    Get total coin capital summary with statistics
 * @access  Public
 */
router.get("/coin-capital/summary/total", async (req, res) => {
  try {
    const result = await getCoinCapitalSummary();
    
    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

module.exports = router;
