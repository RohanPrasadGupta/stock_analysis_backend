const StockTransaction = require("../model/model");

/**
 * Create a new stock transaction
 */
const createTransaction = async (transactionData) => {
  try {
    const transaction = new StockTransaction(transactionData);
    const savedTransaction = await transaction.save();
    return {
      success: true,
      data: savedTransaction,
      message: "Transaction created successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: "Failed to create transaction",
    };
  }
};

/**
 * Get all stock transactions with optional filters
 */
const getAllTransactions = async (filters = {}) => {
  try {
    const query = {};
    
    // Apply filters if provided
    if (filters.stockSymbol) {
      query.stockSymbol = filters.stockSymbol.toUpperCase();
    }
    if (filters.type) {
      query.type = filters.type.toUpperCase();
    }
    if (filters.startDate || filters.endDate) {
      query.investedDate = {};
      if (filters.startDate) {
        query.investedDate.$gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        query.investedDate.$lte = new Date(filters.endDate);
      }
    }

    const transactions = await StockTransaction.find(query).sort({ investedDate: -1 });
    
    return {
      success: true,
      data: transactions,
      count: transactions.length,
      message: "Transactions retrieved successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: "Failed to retrieve transactions",
    };
  }
};

/**
 * Get a single stock transaction by ID
 */
const getTransactionById = async (id) => {
  try {
    const transaction = await StockTransaction.findById(id);
    
    if (!transaction) {
      return {
        success: false,
        message: "Transaction not found",
      };
    }

    return {
      success: true,
      data: transaction,
      message: "Transaction retrieved successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: "Failed to retrieve transaction",
    };
  }
};

/**
 * Update a stock transaction
 */
const updateTransaction = async (id, updateData) => {
  try {
    // If price or quantity is updated, recalculate totalAmount
    if (updateData.price || updateData.quantity) {
      const transaction = await StockTransaction.findById(id);
      if (!transaction) {
        return {
          success: false,
          message: "Transaction not found",
        };
      }
      
      const newPrice = updateData.price || transaction.price;
      const newQuantity = updateData.quantity || transaction.quantity;
      updateData.totalAmount = newPrice * newQuantity;
    }

    const updatedTransaction = await StockTransaction.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true, // Return the updated document
        runValidators: true, // Run schema validators
      }
    );

    if (!updatedTransaction) {
      return {
        success: false,
        message: "Transaction not found",
      };
    }

    return {
      success: true,
      data: updatedTransaction,
      message: "Transaction updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: "Failed to update transaction",
    };
  }
};

/**
 * Delete a stock transaction
 */
const deleteTransaction = async (id) => {
  try {
    const deletedTransaction = await StockTransaction.findByIdAndDelete(id);

    if (!deletedTransaction) {
      return {
        success: false,
        message: "Transaction not found",
      };
    }

    return {
      success: true,
      data: deletedTransaction,
      message: "Transaction deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: "Failed to delete transaction",
    };
  }
};

/**
 * Get portfolio summary (total invested, current holdings, etc.)
 */
const getPortfolioSummary = async () => {
  try {
    const transactions = await StockTransaction.find();
    
    // Calculate portfolio metrics
    const summary = transactions.reduce((acc, transaction) => {
      const symbol = transaction.stockSymbol;
      
      if (!acc[symbol]) {
        acc[symbol] = {
          stockSymbol: symbol,
          stockName: transaction.stockName,
          totalQuantity: 0,
          totalInvested: 0,
          transactions: [],
        };
      }
      
      if (transaction.type === "BUY") {
        acc[symbol].totalQuantity += transaction.quantity;
        acc[symbol].totalInvested += transaction.totalAmount;
      } else if (transaction.type === "SELL") {
        acc[symbol].totalQuantity -= transaction.quantity;
        acc[symbol].totalInvested -= transaction.totalAmount;
      }
      
      acc[symbol].transactions.push(transaction);
      
      return acc;
    }, {});

    return {
      success: true,
      data: Object.values(summary),
      message: "Portfolio summary retrieved successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: "Failed to retrieve portfolio summary",
    };
  }
};

module.exports = {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getPortfolioSummary,
};
