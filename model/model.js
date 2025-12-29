const mongoose = require("mongoose");

const stockTransactionSchema = new mongoose.Schema(
  {
    stockSymbol: {
      type: String,
      required: [true, "Stock symbol is required"],
      uppercase: true,
      trim: true,
    },
    stockName: {
      type: String,
      required: [true, "Stock name is required"],
      trim: true,
    },
    type: {
      type: String,
      required: [true, "Transaction type is required"],
      enum: {
        values: ["BUY", "SELL"],
        message: "Type must be either BUY or SELL",
      },
      uppercase: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be a positive number"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: [0, "Total amount must be a positive number"],
    },
    investedDate: {
      type: Date,
      required: [true, "Invested date is required"],
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Pre-save middleware to calculate totalAmount if not provided
stockTransactionSchema.pre("save", function (next) {
  if (this.price && this.quantity && !this.totalAmount) {
    this.totalAmount = this.price * this.quantity;
  }
  next();
});

const StockTransaction = mongoose.model("StockTransaction", stockTransactionSchema);

module.exports = StockTransaction;
