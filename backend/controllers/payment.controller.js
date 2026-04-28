const Payment = require("../models/Payment");
const Booking = require("../models/Booking");
const AppError = require("../utils/appError");
const { sendSuccess } = require("../utils/apiResponse");
const { createPaymentIntent } = require("../services/payment.service");

async function createIntent(req, res) {
  const booking = await Booking.findById(req.params.bookingId).populate("customer", "email");

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  if (String(booking.customer._id) !== String(req.user._id)) {
    throw new AppError("You can only pay for your own booking", 403);
  }

  const payment = await Payment.findOneAndUpdate(
    { booking: booking._id },
    {
      $setOnInsert: {
        customer: req.user._id,
        amount: booking.finalCost || booking.priceEstimate,
        provider: "stripe",
        status: "pending"
      }
    },
    { upsert: true, new: true }
  );

  const intent = await createPaymentIntent({
    bookingId: booking._id.toString(),
    amount: payment.amount,
    customerEmail: booking.customer.email
  });

  payment.transactionId = intent.id;
  payment.clientSecret = intent.client_secret;
  payment.status = "authorized";
  payment.metadata = intent;
  await payment.save();

  booking.paymentStatus = "authorized";
  await booking.save();

  return sendSuccess(res, {
    data: {
      payment,
      clientSecret: intent.client_secret
    },
    message: "Payment intent created"
  });
}

async function listPayments(req, res) {
  let filter = { customer: req.user._id };

  if (req.accountType === "mechanic") {
    const bookingIds = await Booking.find({ mechanic: req.user._id }).distinct("_id");
    filter = { booking: { $in: bookingIds } };
  }

  const payments = await Payment.find(filter).populate("booking").sort({ createdAt: -1 });
  return sendSuccess(res, { data: payments });
}

module.exports = {
  createIntent,
  listPayments
};
