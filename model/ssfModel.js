const mongoose = require("mongoose");

const ssfCapitalSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount must be a positive number"],
    },
    monthsPaid: {
      type: Number,
      required: [true, "Number of months paid is required"],
      min: [1, "Months paid must be at least 1"],
    },
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: [0, "Total amount must be a positive number"],
    },
    dateAdded: {
      type: Date,
      required: [true, "Date added is required"],
    },
    paidDate: {
      type: Date,
      required: [true, "Paid date is required"],
    },
    currency: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      default: "NPR",
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

ssfCapitalSchema.pre("save", function (next) {
  if (this.amount !== undefined && this.monthsPaid !== undefined) {
    this.totalAmount = this.amount * this.monthsPaid;
  }
  next();
});

ssfCapitalSchema.index({ paidDate: -1 });
ssfCapitalSchema.index({ dateAdded: -1 });

const SsfCapital = mongoose.model("SsfCapital", ssfCapitalSchema);

module.exports = SsfCapital;
