const Mechanic = require("../models/Mechanic");
const Booking = require("../models/Booking");
const Review = require("../models/Review");
const generateToken = require("../utils/generateToken");
const AppError = require("../utils/appError");
const { sendSuccess } = require("../utils/apiResponse");
const { findNearbyMechanics } = require("../services/maps.service");

async function mechanicSignup(req, res) {
  const { name, email, phone, password, experienceYears, skills, vehicleTypes } = req.body;
  const existingMechanic = await Mechanic.findOne({ email });

  if (existingMechanic) {
    throw new AppError("Mechanic email already registered", 409);
  }

  const mechanic = await Mechanic.create({
    name,
    email,
    phone,
    password,
    experienceYears,
    skills,
    vehicleTypes,
    availabilityStatus: "offline"
  });

  const token = generateToken({ id: mechanic._id, role: "mechanic", accountType: "mechanic" });
  return sendSuccess(res, {
    statusCode: 201,
    data: { mechanic: { ...mechanic.toJSON(), role: "mechanic" }, token },
    message: "Mechanic account created"
  });
}

async function mechanicLogin(req, res) {
  const { email, password } = req.body;
  const mechanic = await Mechanic.findOne({ email });

  if (!mechanic || !(await mechanic.comparePassword(password))) {
    throw new AppError("Invalid mechanic credentials", 401);
  }

  const token = generateToken({ id: mechanic._id, role: "mechanic", accountType: "mechanic" });
  return sendSuccess(res, {
    data: { mechanic: { ...mechanic.toJSON(), role: "mechanic" }, token },
    message: "Mechanic login successful"
  });
}

async function getMechanics(req, res) {
  if (req.query.latitude && req.query.longitude) {
    const nearbyMechanics = await findNearbyMechanics(
      {
        latitude: Number(req.query.latitude),
        longitude: Number(req.query.longitude)
      },
      {
        maxDistanceKm: Number(req.query.radiusKm || 15),
        limit: Number(req.query.limit || 10)
      }
    );

    return sendSuccess(res, {
      data: nearbyMechanics.map(({ mechanic, distanceKm, etaMinutes }) => ({
        ...mechanic.toJSON(),
        role: "mechanic",
        distanceKm,
        etaMinutes
      }))
    });
  }

  const mechanics = await Mechanic.find({
    isAvailable: true,
    availabilityStatus: { $in: ["online", "busy"] }
  })
    .sort({ averageRating: -1, createdAt: -1 })
    .limit(20);

  return sendSuccess(res, { data: mechanics });
}

async function dashboardSummary(req, res) {
  const availableRequests = await Booking.find({
    status: "requested",
    requestedMechanics: req.user._id,
    rejectedBy: { $ne: req.user._id }
  })
    .populate("customer", "name phone")
    .sort({ createdAt: -1 })
    .limit(20);

  const activeBooking = await Booking.findOne({
    mechanic: req.user._id,
    status: { $in: ["assigned", "en_route", "arrived", "in_service", "payment_pending"] }
  })
    .populate("customer", "name phone vehicles")
    .sort({ createdAt: -1 });

  const bookingHistory = await Booking.find({
    mechanic: req.user._id,
    status: { $in: ["completed", "cancelled"] }
  })
    .populate("customer", "name phone")
    .sort({ createdAt: -1 })
    .limit(15);

  const completedJobs = await Booking.countDocuments({ mechanic: req.user._id, status: "completed" });
  const activeJobs = await Booking.countDocuments({
    mechanic: req.user._id,
    status: { $in: ["assigned", "en_route", "arrived", "in_service", "payment_pending"] }
  });
  const ratingStats = await Review.aggregate([
    { $match: { mechanic: req.user._id } },
    {
      $group: {
        _id: "$mechanic",
        averageRating: { $avg: "$rating" },
        ratingsCount: { $sum: 1 }
      }
    }
  ]);

  return sendSuccess(res, {
    data: {
      profile: {
        ...req.user.toJSON(),
        role: "mechanic"
      },
      metrics: {
        availableRequests: availableRequests.length,
        activeJobs,
        completedJobs,
        earnings: req.user.earnings,
        averageRating: ratingStats[0]?.averageRating || req.user.averageRating || 0,
        ratingsCount: ratingStats[0]?.ratingsCount || 0
      },
      availableRequests,
      activeBooking,
      bookingHistory
    }
  });
}

async function updateAvailability(req, res) {
  req.user.isAvailable = req.body.isAvailable;
  req.user.availabilityStatus = req.body.isAvailable ? "online" : "offline";
  await req.user.save();

  req.app.get("io").to(String(req.user._id)).emit("mechanic:availability", {
    mechanicId: req.user._id,
    isAvailable: req.user.isAvailable,
    availabilityStatus: req.user.availabilityStatus
  });

  return sendSuccess(res, {
    data: {
      ...req.user.toJSON(),
      role: "mechanic"
    },
    message: "Availability updated"
  });
}

async function updateLocation(req, res) {
  const latitude = Number(req.body.latitude);
  const longitude = Number(req.body.longitude);

  req.user.location = {
    type: "Point",
    coordinates: [longitude, latitude]
  };
  req.user.locationLabel = req.body.address || req.user.locationLabel;
  req.user.lastLocationUpdatedAt = new Date();
  await req.user.save();

  const activeBooking = await Booking.findOne({
    mechanic: req.user._id,
    status: { $in: ["assigned", "en_route", "arrived", "in_service", "payment_pending"] }
  });

  if (activeBooking) {
    activeBooking.mechanicLocation = {
      latitude,
      longitude,
      address: req.body.address || req.user.locationLabel || ""
    };
    await activeBooking.save();
    req.app.get("io").to(`booking:${activeBooking._id}`).emit("mechanic:location", {
      bookingId: activeBooking._id,
      latitude,
      longitude,
      address: activeBooking.mechanicLocation.address
    });
  }

  return sendSuccess(res, {
    data: {
      ...req.user.toJSON(),
      role: "mechanic"
    },
    message: "Location updated"
  });
}

module.exports = {
  mechanicSignup,
  mechanicLogin,
  getMechanics,
  dashboardSummary,
  updateAvailability,
  updateLocation
};
