const express = require("express");
const { getChatByBooking, sendMessage } = require("../controllers/chat.controller");
const { protect } = require("../middleware/auth");
const catchAsync = require("../utils/catchAsync");
const validate = require("../middleware/validate");
const { required } = require("../utils/validation");

const router = express.Router();

router.use(protect);
router.get("/:bookingId", catchAsync(getChatByBooking));
router.post(
  "/:bookingId/messages",
  validate((req) => [required(req.body.text, "text")]),
  catchAsync(sendMessage)
);

module.exports = router;
