const Notification = require("../models/Notification");
const AppError = require("../utils/appError");
const { sendSuccess } = require("../utils/apiResponse");

async function listNotifications(req, res) {
  const recipientType = req.accountType === "mechanic" ? "mechanic" : "user";
  const notifications = await Notification.find({
    recipientType,
    recipientId: req.user._id
  }).sort({ createdAt: -1 });

  return sendSuccess(res, { data: notifications });
}

async function markAsRead(req, res) {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    throw new AppError("Notification not found", 404);
  }

  if (String(notification.recipientId) !== String(req.user._id)) {
    throw new AppError("You do not have access to this notification", 403);
  }

  notification.read = true;
  await notification.save();

  return sendSuccess(res, {
    data: notification,
    message: "Notification marked as read"
  });
}

module.exports = {
  listNotifications,
  markAsRead
};
