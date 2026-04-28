const Booking = require("../models/Booking");
const Review = require("../models/Review");
const AppError = require("../utils/appError");
const { sendSuccess } = require("../utils/apiResponse");

async function createReview(req, res) {
  const booking = await Booking.findById(req.body.booking);

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  if (String(booking.customer) !== String(req.user._id)) {
    throw new AppError("You can only review your own booking", 403);
  }

  if (booking.status !== "completed") {
    throw new AppError("Reviews can only be submitted for completed bookings", 409);
  }

  if (String(booking.mechanic) !== String(req.body.mechanic)) {
    throw new AppError("Review mechanic does not match the booking", 409);
  }

  const review = await Review.create({
    booking: req.body.booking,
    customer: req.user._id,
    mechanic: req.body.mechanic,
    rating: req.body.rating,
    comment: req.body.comment
  });

  return sendSuccess(res, {
    statusCode: 201,
    data: review,
    message: "Review created"
  });
}

module.exports = {
  createReview
};
