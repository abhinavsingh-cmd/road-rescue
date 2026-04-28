const Notification = require("../models/Notification");

async function createNotification(payload, io) {
  const notification = await Notification.create(payload);

  if (io) {
    io.to(String(payload.recipientId)).emit("notification:new", notification);
  }

  return notification;
}

module.exports = {
  createNotification
};
