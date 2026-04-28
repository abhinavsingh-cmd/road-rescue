const express = require("express");
const { createReview } = require("../controllers/review.controller");
const { protect, authorize } = require("../middleware/auth");
const catchAsync = require("../utils/catchAsync");
const validate = require("../middleware/validate");
const { required, isNumber } = require("../utils/validation");

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("customer"),
  validate((req) => [
    required(req.body.booking, "booking"),
    required(req.body.mechanic, "mechanic"),
    isNumber(req.body.rating, "rating")
  ]),
  catchAsync(createReview)
);

module.exports = router;
