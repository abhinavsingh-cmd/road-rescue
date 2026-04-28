const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true
    },
    participants: [
      {
        participantId: mongoose.Schema.Types.ObjectId,
        role: {
          type: String,
          enum: ["customer", "mechanic", "support"]
        }
      }
    ],
    messages: [
      {
        senderId: mongoose.Schema.Types.ObjectId,
        senderName: String,
        senderRole: {
          type: String,
          enum: ["customer", "mechanic", "support"]
        },
        text: String,
        sentAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  { timestamps: true }
);

chatSchema.index({ booking: 1 }, { unique: true });

module.exports = mongoose.model("Chat", chatSchema);
