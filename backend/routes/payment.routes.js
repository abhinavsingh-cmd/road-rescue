const express = require("express");
const { createIntent, listPayments } = require("../controllers/payment.controller");
const { protect, authorize } = require("../middleware/auth");
const catchAsync = require("../utils/catchAsync");

const router = express.Router();

router.use(protect);
router.get("/", catchAsync(listPayments));
router.post("/:bookingId/intent", authorize("customer"), catchAsync(createIntent));

module.exports = router;
