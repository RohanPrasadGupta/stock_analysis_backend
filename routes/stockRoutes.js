const express = require("express");
const router = express.Router();
const {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getPortfolioSummary,
} = require("../services/stockdata");

/**
 * @route   POST /api/transactions
 * @desc    Create a new stock transaction
 * @access  Public
 */
router.post("/transactions", async (req, res) => {
  try {
    const result = await createTransaction(req.body);
    
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
 * @route   GET /api/transactions
 * @desc    Get all stock transactions with optional filters
 * @query   stockSymbol, type, startDate, endDate
 * @access  Public
 */
router.get("/transactions", async (req, res) => {
  try {
    const filters = {
      stockSymbol: req.query.stockSymbol,
      type: req.query.type,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
    };

    const result = await getAllTransactions(filters);
    
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
 * @route   GET /api/transactions/:id
 * @desc    Get a single stock transaction by ID
 * @access  Public
 */
router.get("/transactions/:id", async (req, res) => {
  try {
    const result = await getTransactionById(req.params.id);
    
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
 * @route   PUT /api/transactions/:id
 * @desc    Update a stock transaction
 * @access  Public
 */
router.put("/transactions/:id", async (req, res) => {
  try {
    const result = await updateTransaction(req.params.id, req.body);
    
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
 * @route   PATCH /api/transactions/:id
 * @desc    Partially update a stock transaction
 * @access  Public
 */
router.patch("/transactions/:id", async (req, res) => {
  try {
    const result = await updateTransaction(req.params.id, req.body);
    
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
 * @route   DELETE /api/transactions/:id
 * @desc    Delete a stock transaction
 * @access  Public
 */
router.delete("/transactions/:id", async (req, res) => {
  try {
    const result = await deleteTransaction(req.params.id);
    
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
 * @route   GET /api/portfolio/summary
 * @desc    Get portfolio summary with holdings per stock
 * @access  Public
 */
router.get("/portfolio/summary", async (req, res) => {
  try {
    const result = await getPortfolioSummary();
    
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
