const mongoose = require("mongoose");

const sipCapitalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
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
sipCapitalSchema.index({ date: -1 });

const SipCapital = mongoose.model("SipCapital", sipCapitalSchema);

module.exports = SipCapital;
