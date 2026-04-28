const express = require("express");
const { listNotifications, markAsRead } = require("../controllers/notification.controller");
const { protect } = require("../middleware/auth");
const catchAsync = require("../utils/catchAsync");

const router = express.Router();

router.get("/", protect, catchAsync(listNotifications));
router.patch("/:id/read", protect, catchAsync(markAsRead));

module.exports = router;
