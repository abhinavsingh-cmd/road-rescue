const Booking = require("../models/Booking");
const AppError = require("../utils/appError");
const Chat = require("../models/Chat");
const { sendSuccess } = require("../utils/apiResponse");

async function ensureChatAccess(req, bookingId) {
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  const userId = String(req.user._id);
  const isCustomer = String(booking.customer) === userId;
  const isMechanic = booking.mechanic ? String(booking.mechanic) === userId : false;

  if (!isCustomer && !isMechanic && req.user.role !== "admin") {
    throw new AppError("You do not have access to this chat", 403);
  }

  return booking;
}

async function getChatByBooking(req, res) {
  const booking = await ensureChatAccess(req, req.params.bookingId);
  let chat = await Chat.findOne({ booking: req.params.bookingId });

  if (!chat) {
    chat = await Chat.create({
      booking: req.params.bookingId,
      participants: [
        {
          participantId: booking.customer,
          role: "customer"
        },
        ...(booking.mechanic
          ? [
              {
                participantId: booking.mechanic,
                role: "mechanic"
              }
            ]
          : [])
      ]
    });
  }

  return sendSuccess(res, { data: chat });
}

async function sendMessage(req, res) {
  const booking = await ensureChatAccess(req, req.params.bookingId);
  let chat = await Chat.findOne({ booking: req.params.bookingId });

  if (!chat) {
    chat = await Chat.create({
      booking: req.params.bookingId,
      participants: [
        {
          participantId: booking.customer,
          role: "customer"
        },
        ...(booking.mechanic
          ? [
              {
                participantId: booking.mechanic,
                role: "mechanic"
              }
            ]
          : [])
      ]
    });
  }

  chat.messages.push({
    senderId: req.user._id,
    senderName: req.user.name,
    senderRole: req.accountType === "mechanic" ? "mechanic" : req.user.role,
    text: req.body.text
  });

  await chat.save();

  const message = chat.messages[chat.messages.length - 1];
  req.app.get("io").to(`booking:${req.params.bookingId}`).emit("chat:message", message);

  return sendSuccess(res, {
    statusCode: 201,
    data: message,
    message: "Message sent"
  });
}

module.exports = {
  getChatByBooking,
  sendMessage
};
