const mongoose = require("mongoose");

const coinCapitalSchema = new mongoose.Schema(
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
    transactionCharge: {
      type: Number,
      required: [true, "Transaction charge is required"],
      min: [0, "Transaction charge must be a positive number"],
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: [0, "Total amount must be a positive number"],
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Pre-save middleware to calculate totalAmount if not provided
coinCapitalSchema.pre("save", function (next) {
  if (this.amount !== undefined && this.transactionCharge !== undefined && !this.totalAmount) {
    this.totalAmount = this.amount + this.transactionCharge;
  }
  next();
});

// Index on date for faster queries
coinCapitalSchema.index({ date: -1 });

const CoinCapital = mongoose.model("CoinCapital", coinCapitalSchema);

module.exports = CoinCapital;
