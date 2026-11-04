const SsfCapital = require("../model/ssfModel");

const createSsfCapital = async (ssfData) => {
  try {
    if (ssfData.amount !== undefined && ssfData.monthsPaid !== undefined) {
      ssfData.totalAmount = ssfData.amount * ssfData.monthsPaid;
    }

    const ssfCapital = new SsfCapital(ssfData);
    const savedSsfCapital = await ssfCapital.save();

    return {
      success: true,
      data: savedSsfCapital,
      message: "SSF capital record created successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: "Failed to create SSF capital record",
    };
  }
};

const getAllSsfCapitals = async (filters = {}) => {
  try {
    const query = {};

    if (filters.startDate || filters.endDate) {
      query.paidDate = {};
      if (filters.startDate) {
        query.paidDate.$gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        query.paidDate.$lte = new Date(filters.endDate);
      }
    }

    const ssfCapitals = await SsfCapital.find(query).sort({ paidDate: -1 });

    const totalAmount = ssfCapitals.reduce(
      (sum, record) => sum + record.totalAmount,
      0
    );
    const totalMonthsPaid = ssfCapitals.reduce(
      (sum, record) => sum + record.monthsPaid,
      0
    );

    return {
      success: true,
      data: ssfCapitals,
      count: ssfCapitals.length,
      totalAmount,
      totalMonthsPaid,
      message: "SSF capital records retrieved successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: "Failed to retrieve SSF capital records",
    };
  }
};

const getSsfCapitalById = async (id) => {
  try {
    const ssfCapital = await SsfCapital.findById(id);

    if (!ssfCapital) {
      return {
        success: false,
        message: "SSF capital record not found",
      };
    }

    return {
      success: true,
      data: ssfCapital,
      message: "SSF capital record retrieved successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: "Failed to retrieve SSF capital record",
    };
  }
};

const updateSsfCapital = async (id, updateData) => {
  try {
    if (updateData.amount !== undefined || updateData.monthsPaid !== undefined) {
      const capital = await SsfCapital.findById(id);
      if (!capital) {
        return {
          success: false,
          message: "SSF capital record not found",
        };
      }

      const newAmount =
        updateData.amount !== undefined ? updateData.amount : capital.amount;
      const newMonthsPaid =
        updateData.monthsPaid !== undefined
          ? updateData.monthsPaid
          : capital.monthsPaid;

      updateData.totalAmount = newAmount * newMonthsPaid;
    }

    const updatedSsfCapital = await SsfCapital.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedSsfCapital) {
      return {
        success: false,
        message: "SSF capital record not found",
      };
    }

    return {
      success: true,
      data: updatedSsfCapital,
      message: "SSF capital record updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: "Failed to update SSF capital record",
    };
  }
};

const deleteSsfCapital = async (id) => {
  try {
    const deletedSsfCapital = await SsfCapital.findByIdAndDelete(id);

    if (!deletedSsfCapital) {
      return {
        success: false,
        message: "SSF capital record not found",
      };
    }

    return {
      success: true,
      data: deletedSsfCapital,
      message: "SSF capital record deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: "Failed to delete SSF capital record",
    };
  }
};

const getSsfCapitalSummary = async (filters = {}) => {
  try {
    const query = {};

    if (filters.startDate || filters.endDate) {
      query.paidDate = {};
      if (filters.startDate) {
        query.paidDate.$gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        query.paidDate.$lte = new Date(filters.endDate);
      }
    }

    const ssfCapitals = await SsfCapital.find(query).sort({ paidDate: 1 });

    if (ssfCapitals.length === 0) {
      return {
        success: true,
        data: {
          totalAmount: 0,
          totalMonthsPaid: 0,
          recordCount: 0,
          firstPaidDate: null,
          lastPaidDate: null,
          averageAmount: 0,
        },
        message: "No SSF capital records found",
      };
    }

    const totalAmount = ssfCapitals.reduce(
      (sum, record) => sum + record.totalAmount,
      0
    );
    const totalMonthsPaid = ssfCapitals.reduce(
      (sum, record) => sum + record.monthsPaid,
      0
    );

    return {
      success: true,
      data: {
        totalAmount,
        totalMonthsPaid,
        recordCount: ssfCapitals.length,
        firstPaidDate: ssfCapitals[0].paidDate,
        lastPaidDate: ssfCapitals[ssfCapitals.length - 1].paidDate,
        averageAmount: totalAmount / ssfCapitals.length,
        records: ssfCapitals,
      },
      message: "SSF capital summary retrieved successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: "Failed to retrieve SSF capital summary",
    };
  }
};

module.exports = {
  createSsfCapital,
  getAllSsfCapitals,
  getSsfCapitalById,
  updateSsfCapital,
  deleteSsfCapital,
  getSsfCapitalSummary,
};
