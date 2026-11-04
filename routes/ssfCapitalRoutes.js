const express = require("express");
const router = express.Router();
const {
  createSsfCapital,
  getAllSsfCapitals,
  getSsfCapitalById,
  updateSsfCapital,
  deleteSsfCapital,
  getSsfCapitalSummary,
} = require("../services/ssfCapitalService");

/**
 * @route   POST /api/ssf-capital
 * @desc    Create a new SSF capital record
 */
router.post("/ssf-capital", async (req, res) => {
  try {
    const result = await createSsfCapital(req.body);

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
 * @route   GET /api/ssf-capital
 * @desc    Get all SSF capital records with optional filters
 * @query   startDate, endDate (filters on paidDate)
 */
router.get("/ssf-capital", async (req, res) => {
  try {
    const filters = {
      startDate: req.query.startDate,
      endDate: req.query.endDate,
    };

    const result = await getAllSsfCapitals(filters);

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
 * @route   GET /api/ssf-capital/summary/total
 * @desc    Get SSF capital summary with statistics
 */
router.get("/ssf-capital/summary/total", async (req, res) => {
  try {
    const filters = {
      startDate: req.query.startDate,
      endDate: req.query.endDate,
    };

    const result = await getSsfCapitalSummary(filters);

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
 * @route   GET /api/ssf-capital/:id
 * @desc    Get a single SSF capital record by ID
 */
router.get("/ssf-capital/:id", async (req, res) => {
  try {
    const result = await getSsfCapitalById(req.params.id);

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
 * @route   PUT /api/ssf-capital/:id
 * @desc    Update an SSF capital record
 */
router.put("/ssf-capital/:id", async (req, res) => {
  try {
    const result = await updateSsfCapital(req.params.id, req.body);

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
 * @route   PATCH /api/ssf-capital/:id
 * @desc    Partially update an SSF capital record
 */
router.patch("/ssf-capital/:id", async (req, res) => {
  try {
    const result = await updateSsfCapital(req.params.id, req.body);

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
 * @route   DELETE /api/ssf-capital/:id
 * @desc    Delete an SSF capital record
 */
router.delete("/ssf-capital/:id", async (req, res) => {
  try {
    const result = await deleteSsfCapital(req.params.id);

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

module.exports = router;
