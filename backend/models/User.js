const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
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
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer"
    },
    address: {
      type: String,
      trim: true
    },
    savedLocations: [
      {
        label: { type: String, required: true }, // e.g., "Home", "Office"
        address: String,
        latitude: Number,
        longitude: Number
      }
    ],
    currentLocation: {
      latitude: Number,
      longitude: Number,
      address: String
    },
    vehicles: [
      {
        make: { type: String, required: true },
        model: { type: String, required: true },
        year: Number,
        color: String,
        licensePlate: String,
        fuelType: { type: String, enum: ["Petrol", "Diesel", "Electric", "Hybrid"] },
        isDefault: { type: Boolean, default: false }
      }
    ],
    emergencyContacts: [
      {
        name: String,
        phone: String,
        relation: String
      }
    ]
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

userSchema.index({ createdAt: -1 });

userSchema.pre("save", async function save(next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  return next();
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
