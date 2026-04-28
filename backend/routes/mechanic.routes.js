const express = require("express");
const {
  mechanicSignup,
  mechanicLogin,
  getMechanics,
  dashboardSummary,
  updateAvailability,
  updateLocation
} = require("../controllers/mechanic.controller");
const { protect, authorize } = require("../middleware/auth");
const catchAsync = require("../utils/catchAsync");
const validate = require("../middleware/validate");
const { required, email, minLength, isBoolean, isNumber } = require("../utils/validation");

const router = express.Router();

router.get("/", catchAsync(getMechanics));
router.post(
  "/signup",
  validate((req) => [
    required(req.body.name, "name"),
    email(req.body.email),
    required(req.body.phone, "phone"),
    minLength(req.body.password, 6, "password")
  ]),
  catchAsync(mechanicSignup)
);
router.post(
  "/login",
  validate((req) => [email(req.body.email), minLength(req.body.password, 6, "password")]),
  catchAsync(mechanicLogin)
);
router.get("/dashboard/summary", protect, authorize("mechanic"), catchAsync(dashboardSummary));
router.patch(
  "/availability",
  protect,
  authorize("mechanic"),
  validate((req) => [isBoolean(req.body.isAvailable, "isAvailable")]),
  catchAsync(updateAvailability)
);
router.patch(
  "/location",
  protect,
  authorize("mechanic"),
  validate((req) => [
    isNumber(req.body.latitude, "latitude"),
    isNumber(req.body.longitude, "longitude"),
    required(req.body.address, "address")
  ]),
  catchAsync(updateLocation)
);

module.exports = router;
