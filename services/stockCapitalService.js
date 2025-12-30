const StockCapital = require("../model/stockModel");

/**
 * Create a new stock capital record
 */
const createCapital = async (capitalData) => {
  try {
    const capital = new StockCapital(capitalData);
    const savedCapital = await capital.save();
    return {
      success: true,
      data: savedCapital,
      message: "Capital record created successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: "Failed to create capital record",
    };
  }
};

/**
 * Get all stock capital records with optional filters
 */
const getAllCapitals = async (filters = {}) => {
  try {
    const query = {};
    
    // Apply date range filters if provided
    if (filters.startDate || filters.endDate) {
      query.date = {};
      if (filters.startDate) {
        query.date.$gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        query.date.$lte = new Date(filters.endDate);
      }
    }

    const capitals = await StockCapital.find(query).sort({ date: -1 });
    
    // Calculate total capital invested
    const totalAmount = capitals.reduce((sum, record) => sum + record.amount, 0);
    
    return {
      success: true,
      data: capitals,
      count: capitals.length,
      totalAmount: totalAmount,
      message: "Capital records retrieved successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: "Failed to retrieve capital records",
    };
  }
};

/**
 * Get a single stock capital record by ID
 */
const getCapitalById = async (id) => {
  try {
    const capital = await StockCapital.findById(id);
    
    if (!capital) {
      return {
        success: false,
        message: "Capital record not found",
      };
    }

    return {
      success: true,
      data: capital,
      message: "Capital record retrieved successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: "Failed to retrieve capital record",
    };
  }
};

/**
 * Update a stock capital record
 */
const updateCapital = async (id, updateData) => {
  try {
    const updatedCapital = await StockCapital.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true, // Return the updated document
        runValidators: true, // Run schema validators
      }
    );

    if (!updatedCapital) {
      return {
        success: false,
        message: "Capital record not found",
      };
    }

    return {
      success: true,
      data: updatedCapital,
      message: "Capital record updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: "Failed to update capital record",
    };
  }
};

/**
 * Delete a stock capital record
 */
const deleteCapital = async (id) => {
  try {
    const deletedCapital = await StockCapital.findByIdAndDelete(id);

    if (!deletedCapital) {
      return {
        success: false,
        message: "Capital record not found",
      };
    }

    return {
      success: true,
      data: deletedCapital,
      message: "Capital record deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: "Failed to delete capital record",
    };
  }
};

/**
 * Get total capital summary
 */
const getCapitalSummary = async () => {
  try {
    const capitals = await StockCapital.find().sort({ date: 1 });
    
    if (capitals.length === 0) {
      return {
        success: true,
        data: {
          totalCapital: 0,
          recordCount: 0,
          firstInvestmentDate: null,
          lastInvestmentDate: null,
        },
        message: "No capital records found",
      };
    }

    const totalCapital = capitals.reduce((sum, record) => sum + record.amount, 0);
    const firstInvestmentDate = capitals[0].date;
    const lastInvestmentDate = capitals[capitals.length - 1].date;

    return {
      success: true,
      data: {
        totalCapital,
        recordCount: capitals.length,
        firstInvestmentDate,
        lastInvestmentDate,
        averageInvestment: totalCapital / capitals.length,
      },
      message: "Capital summary retrieved successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: "Failed to retrieve capital summary",
    };
  }
};

module.exports = {
  createCapital,
  getAllCapitals,
  getCapitalById,
  updateCapital,
  deleteCapital,
  getCapitalSummary,
};
