const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: "INR"
    },
    provider: {
      type: String,
      enum: ["stripe", "razorpay", "manual"],
      default: "stripe"
    },
    status: {
      type: String,
      enum: ["pending", "authorized", "paid", "failed", "refunded"],
      default: "pending"
    },
    transactionId: String,
    clientSecret: String,
    metadata: {
      type: Object,
      default: {}
    }
  },
  { timestamps: true }
);

paymentSchema.index({ booking: 1 });
paymentSchema.index({ customer: 1, createdAt: -1 });

module.exports = mongoose.model("Payment", paymentSchema);
