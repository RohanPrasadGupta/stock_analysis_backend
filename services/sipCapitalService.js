const sipModel = require("../model/sipModel");


const createSipCapital = async (sipData) => {
  try {
    const sipCapital = new sipModel(sipData);
    const savedSipCapital = await sipCapital.save();
    return {
      success: true,
      data: savedSipCapital,
      message: "SIP capital record created successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: "Failed to create SIP capital record",
    };
  }
};

const getAllSipCapitals = async (filters = {}) => {
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

    const sipCapitals = await sipModel.find(query).sort({ date: -1 });
    
    // Calculate total capital invested
    const totalAmount = sipCapitals.reduce((sum, record) => sum + record.amount, 0);
    
    return {
      success: true,
      data: sipCapitals,
      count: sipCapitals.length,
      totalAmount: totalAmount,
      message: "SIP capital records retrieved successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: "Failed to retrieve SIP capital records",
    };
  }
};

const getSipCapitalById = async (id) => {
  try {
    const sipCapital = await sipModel.findById(id);
    
    if (!sipCapital) {
      return {
        success: false,
        message: "SIP capital record not found",
      };
    }
    
    return {
      success: true,
      data: sipCapital,
      message: "SIP capital record retrieved successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: "Failed to retrieve SIP capital record",
    };
  }
};

const deleteSipCapital = async (id) => {
  try {
    const deletedSipCapital = await sipModel.findByIdAndDelete(id);
    
    if (!deletedSipCapital) {
      return {
        success: false,
        message: "SIP capital record not found",
      };
    }
    
    return {
      success: true,
      data: deletedSipCapital,
      message: "SIP capital record deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: "Failed to delete SIP capital record",
    };
  }
};

const updateSipCapital = async (id, updateData) => {
  try {
    const updatedSipCapital = await sipModel.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true, // Return the updated document
        runValidators: true, // Run schema validators
      }
    );
    
    if (!updatedSipCapital) {
      return {
        success: false,
        message: "SIP capital record not found",
      };
    }
    
    return {
      success: true,
      data: updatedSipCapital,
      message: "SIP capital record updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: "Failed to update SIP capital record",
    };
  }
};

const getSipCapitalSummary = async (filters = {}) => {
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

    const sipCapitals = await sipModel.find(query).sort({ date: -1 });
    
    // Calculate total capital invested
    const totalAmount = sipCapitals.reduce((sum, record) => sum + record.amount, 0);
    
    return {
      success: true,
      data: {
        totalAmount,
        count: sipCapitals.length,
        records: sipCapitals,
      },
      message: "SIP capital summary retrieved successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: "Failed to retrieve SIP capital summary",
    };
  }
};

module.exports = {
  createSipCapital,
  getAllSipCapitals,
  getSipCapitalById,
  updateSipCapital,
  deleteSipCapital,
  getSipCapitalSummary
};