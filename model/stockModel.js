const mongoose = require("mongoose");

const stockCapitalSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount must be a positive number"],
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Index on date for faster queries
stockCapitalSchema.index({ date: -1 });

const StockCapital = mongoose.model("StockCapital", stockCapitalSchema);

module.exports = StockCapital;
