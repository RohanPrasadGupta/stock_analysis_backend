const CoinCapital = require("../model/coinModel");

/**
 * Create a new coin capital record
 */
const createCoinCapital = async (capitalData) => {
  try {
    const capital = new CoinCapital(capitalData);
    const savedCapital = await capital.save();
    return {
      success: true,
      data: savedCapital,
      message: "Coin capital record created successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: "Failed to create coin capital record",
    };
  }
};

/**
 * Get all coin capital records with optional filters
 */
const getAllCoinCapitals = async (filters = {}) => {
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

    const capitals = await CoinCapital.find(query).sort({ date: -1 });
    
    // Calculate totals
    const totalAmount = capitals.reduce((sum, record) => sum + record.amount, 0);
    const totalTransactionCharge = capitals.reduce((sum, record) => sum + record.transactionCharge, 0);
    const grandTotal = capitals.reduce((sum, record) => sum + record.totalAmount, 0);
    
    return {
      success: true,
      data: capitals,
      count: capitals.length,
      summary: {
        totalAmount,
        totalTransactionCharge,
        grandTotal,
      },
      message: "Coin capital records retrieved successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: "Failed to retrieve coin capital records",
    };
  }
};

/**
 * Get a single coin capital record by ID
 */
const getCoinCapitalById = async (id) => {
  try {
    const capital = await CoinCapital.findById(id);
    
    if (!capital) {
      return {
        success: false,
        message: "Coin capital record not found",
      };
    }

    return {
      success: true,
      data: capital,
      message: "Coin capital record retrieved successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: "Failed to retrieve coin capital record",
    };
  }
};

/**
 * Update a coin capital record
 */
const updateCoinCapital = async (id, updateData) => {
  try {
    // If amount or transactionCharge is updated, recalculate totalAmount
    if (updateData.amount !== undefined || updateData.transactionCharge !== undefined) {
      const capital = await CoinCapital.findById(id);
      if (!capital) {
        return {
          success: false,
          message: "Coin capital record not found",
        };
      }
      
      const newAmount = updateData.amount !== undefined ? updateData.amount : capital.amount;
      const newTransactionCharge = updateData.transactionCharge !== undefined 
        ? updateData.transactionCharge 
        : capital.transactionCharge;
      
      updateData.totalAmount = newAmount + newTransactionCharge;
    }

    const updatedCapital = await CoinCapital.findByIdAndUpdate(
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
        message: "Coin capital record not found",
      };
    }

    return {
      success: true,
      data: updatedCapital,
      message: "Coin capital record updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: "Failed to update coin capital record",
    };
  }
};

/**
 * Delete a coin capital record
 */
const deleteCoinCapital = async (id) => {
  try {
    const deletedCapital = await CoinCapital.findByIdAndDelete(id);

    if (!deletedCapital) {
      return {
        success: false,
        message: "Coin capital record not found",
      };
    }

    return {
      success: true,
      data: deletedCapital,
      message: "Coin capital record deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: "Failed to delete coin capital record",
    };
  }
};

/**
 * Get total coin capital summary
 */
const getCoinCapitalSummary = async () => {
  try {
    const capitals = await CoinCapital.find().sort({ date: 1 });
    
    if (capitals.length === 0) {
      return {
        success: true,
        data: {
          totalAmount: 0,
          totalTransactionCharge: 0,
          grandTotal: 0,
          recordCount: 0,
          firstInvestmentDate: null,
          lastInvestmentDate: null,
          averageAmount: 0,
          averageTransactionCharge: 0,
        },
        message: "No coin capital records found",
      };
    }

    const totalAmount = capitals.reduce((sum, record) => sum + record.amount, 0);
    const totalTransactionCharge = capitals.reduce((sum, record) => sum + record.transactionCharge, 0);
    const grandTotal = capitals.reduce((sum, record) => sum + record.totalAmount, 0);
    const firstInvestmentDate = capitals[0].date;
    const lastInvestmentDate = capitals[capitals.length - 1].date;

    return {
      success: true,
      data: {
        totalAmount,
        totalTransactionCharge,
        grandTotal,
        recordCount: capitals.length,
        firstInvestmentDate,
        lastInvestmentDate,
        averageAmount: totalAmount / capitals.length,
        averageTransactionCharge: totalTransactionCharge / capitals.length,
      },
      message: "Coin capital summary retrieved successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: "Failed to retrieve coin capital summary",
    };
  }
};

module.exports = {
  createCoinCapital,
  getAllCoinCapitals,
  getCoinCapitalById,
  updateCoinCapital,
  deleteCoinCapital,
  getCoinCapitalSummary,
};
