const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const mechanicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    experienceYears: {
      type: Number,
      default: 0
    },
    skills: [String],
    serviceRadiusKm: {
      type: Number,
      default: 10
    },
    vehicleTypes: [String],
    availabilityStatus: {
      type: String,
      enum: ["offline", "online", "busy"],
      default: "offline"
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      coordinates: {
        type: [Number],
        default: [77.5946, 12.9716]
      }
    },
    locationLabel: {
      type: String,
      trim: true
    },
    lastLocationUpdatedAt: {
      type: Date
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    averageRating: {
      type: Number,
      default: 4.8
    },
    earnings: {
      today: { type: Number, default: 0 },
      week: { type: Number, default: 0 },
      total: { type: Number, default: 0 }
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        return ret;
      }
    }
  }
);

mechanicSchema.index({ location: "2dsphere" });
mechanicSchema.index({ availabilityStatus: 1, isAvailable: 1 });

mechanicSchema.pre("save", async function save(next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  return next();
});

mechanicSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("Mechanic", mechanicSchema);
