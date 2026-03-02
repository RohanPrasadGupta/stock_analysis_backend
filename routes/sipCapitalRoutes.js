const express = require("express");
const router = express.Router();
const {
  createSipCapital,
  getAllSipCapitals,
  getSipCapitalById,
  updateSipCapital,
  deleteSipCapital,
  getSipCapitalSummary,
} = require("../services/sipCapitalService");


router.post("/sip-capital", async (req, res) => {
  try {
    const result = await createSipCapital(req.body);
    
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

router.get("/sip-capital", async (req, res) => {
  try {
    const filters = {
      startDate: req.query.startDate,
      endDate: req.query.endDate,
    };

    const result = await getAllSipCapitals(filters);
    
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

router.get("/sip-capital/:id", async (req, res) => {
  try {
    const result = await getSipCapitalById(req.params.id);
    
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

router.put("/sip-capital/:id", async (req, res) => {
  try {
    const result = await updateSipCapital(req.params.id, req.body);
    
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

router.delete("/sip-capital/:id", async (req, res) => {
  try {
    const result = await deleteSipCapital(req.params.id);
    
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

router.get("/sip-capital/summary/total", async (req, res) => {
  try {
    const result = await getSipCapitalSummary();
    
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
