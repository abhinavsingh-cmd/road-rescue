const express = require("express");
const {
  listBookings,
  createBooking,
  getBookingById,
  updateBookingStatus,
  respondToBooking
} = require("../controllers/booking.controller");
const { protect, authorize } = require("../middleware/auth");
const catchAsync = require("../utils/catchAsync");
const validate = require("../middleware/validate");
const { required, coordinates } = require("../utils/validation");

const router = express.Router();

router.use(protect);
router.get("/", catchAsync(listBookings));
router.post(
  "/",
  authorize("customer"),
  validate((req) => [
    required(req.body.serviceCategory, "serviceCategory"),
    required(req.body.issueType, "issueType"),
    required(req.body.vehicleType, "vehicleType"),
    coordinates(req.body.location)
  ]),
  catchAsync(createBooking)
);
router.get("/:id", catchAsync(getBookingById));
router.patch(
  "/:id/status",
  validate((req) => [required(req.body.status, "status")]),
  catchAsync(updateBookingStatus)
);
router.patch(
  "/:id/respond",
  authorize("mechanic", "admin"),
  validate((req) => [required(req.body.action, "action")]),
  catchAsync(respondToBooking)
);

module.exports = router;
