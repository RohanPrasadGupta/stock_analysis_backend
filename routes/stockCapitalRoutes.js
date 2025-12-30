const express = require("express");
const router = express.Router();
const {
  createCapital,
  getAllCapitals,
  getCapitalById,
  updateCapital,
  deleteCapital,
  getCapitalSummary,
} = require("../services/stockCapitalService");

/**
 * @route   POST /api/capital
 * @desc    Create a new stock capital record
 * @access  Public
 * @body    { date: "2022-03-15", amount: 50000 }
 */
router.post("/capital", async (req, res) => {
  try {
    const result = await createCapital(req.body);
    
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
 * @route   GET /api/capital
 * @desc    Get all stock capital records with optional filters
 * @query   startDate, endDate
 * @access  Public
 */
router.get("/capital", async (req, res) => {
  try {
    const filters = {
      startDate: req.query.startDate,
      endDate: req.query.endDate,
    };

    const result = await getAllCapitals(filters);
    
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
 * @route   GET /api/capital/:id
 * @desc    Get a single stock capital record by ID
 * @access  Public
 */
router.get("/capital/:id", async (req, res) => {
  try {
    const result = await getCapitalById(req.params.id);
    
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
 * @route   PUT /api/capital/:id
 * @desc    Update a stock capital record
 * @access  Public
 * @body    { date: "2022-03-15", amount: 55000 }
 */
router.put("/capital/:id", async (req, res) => {
  try {
    const result = await updateCapital(req.params.id, req.body);
    
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
 * @route   PATCH /api/capital/:id
 * @desc    Partially update a stock capital record
 * @access  Public
 * @body    { amount: 55000 }
 */
router.patch("/capital/:id", async (req, res) => {
  try {
    const result = await updateCapital(req.params.id, req.body);
    
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
 * @route   DELETE /api/capital/:id
 * @desc    Delete a stock capital record
 * @access  Public
 */
router.delete("/capital/:id", async (req, res) => {
  try {
    const result = await deleteCapital(req.params.id);
    
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
 * @route   GET /api/capital/summary/total
 * @desc    Get total capital summary with statistics
 * @access  Public
 */
router.get("/capital/summary/total", async (req, res) => {
  try {
    const result = await getCapitalSummary();
    
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
