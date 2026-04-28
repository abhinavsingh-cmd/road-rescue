const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    bookingCode: {
      type: String,
      unique: true,
      index: true
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    mechanic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mechanic"
    },
    serviceCategory: {
      type: String,
      required: true
    },
    issueType: {
      type: String,
      required: true
    },
    vehicleType: {
      type: String,
      required: true
    },
    problemDescription: {
      type: String
    },
    customerLocation: {
      address: {
        type: String,
        required: true
      },
      latitude: {
        type: Number,
        required: true
      },
      longitude: {
        type: Number,
        required: true
      }
    },
    mechanicLocation: {
      address: String,
      latitude: Number,
      longitude: Number
    },
    requestedMechanics: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Mechanic"
      }
    ],
    rejectedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Mechanic"
      }
    ],
    priceEstimate: {
      type: Number,
      default: 0
    },
    finalCost: {
      type: Number,
      default: 0
    },
    distanceKm: {
      type: Number,
      default: 0
    },
    etaMinutes: {
      type: Number,
      default: 15
    },
    status: {
      type: String,
      enum: ["requested", "assigned", "en_route", "arrived", "in_service", "payment_pending", "completed", "cancelled"],
      default: "requested"
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "authorized", "paid", "failed", "refunded"],
      default: "pending"
    },
    acceptedAt: Date,
    completedAt: Date,
    timeline: [
      {
        status: String,
        note: String,
        actorType: {
          type: String,
          enum: ["customer", "mechanic", "system", "admin"]
        },
        actorId: mongoose.Schema.Types.ObjectId,
        at: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        return ret;
      }
    }
  }
);

bookingSchema.index({ customer: 1, createdAt: -1 });
bookingSchema.index({ mechanic: 1, status: 1, createdAt: -1 });
bookingSchema.index({ requestedMechanics: 1, status: 1 });
bookingSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model("Booking", bookingSchema);
