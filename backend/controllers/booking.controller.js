const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const Mechanic = require("../models/Mechanic");
const Review = require("../models/Review");
const Chat = require("../models/Chat");
const AppError = require("../utils/appError");
const { sendSuccess } = require("../utils/apiResponse");
const { calculateDistanceKm, estimateEtaMinutes, estimatePrice, findNearbyMechanics } = require("../services/maps.service");
const { createNotification } = require("../services/notification.service");

const statusTransitions = {
  requested: ["assigned", "cancelled"],
  assigned: ["en_route", "cancelled"],
  en_route: ["arrived", "cancelled"],
  arrived: ["in_service", "cancelled"],
  in_service: ["payment_pending", "completed"],
  payment_pending: ["completed"],
  completed: [],
  cancelled: []
};

function generateBookingCode() {
  return `RR-${Date.now()}`;
}

function addTimelineEntry(booking, { status, note, actorType, actorId }) {
  booking.timeline.push({
    status,
    note,
    actorType,
    actorId,
    at: new Date()
  });
}

function ensureBookingAccess(req, booking) {
  const userId = String(req.user._id);
  const customerId = booking.customer?._id ? String(booking.customer._id) : String(booking.customer);
  const mechanicId = booking.mechanic?._id ? String(booking.mechanic._id) : String(booking.mechanic || "");

  if (req.accountType === "mechanic" && mechanicId && mechanicId === userId) {
    return true;
  }

  if (req.accountType !== "mechanic" && customerId === userId) {
    return true;
  }

  if (req.user.role === "admin") {
    return true;
  }

  throw new AppError("You do not have access to this booking", 403);
}

async function listBookings(req, res) {
  if (req.accountType === "mechanic" && req.query.scope === "available") {
    const bookings = await Booking.find({
      status: "requested",
      requestedMechanics: req.user._id,
      rejectedBy: { $ne: req.user._id }
    })
      .populate("customer", "name phone vehicles")
      .sort({ createdAt: -1 });

    return sendSuccess(res, { data: bookings });
  }

  const filter = req.accountType === "mechanic" ? { mechanic: req.user._id } : { customer: req.user._id };
  if (req.query.status) {
    filter.status = req.query.status;
  }

  const bookings = await Booking.find(filter)
    .populate("customer", "name phone vehicles")
    .populate("mechanic", "name phone averageRating vehicleTypes locationLabel")
    .sort({ createdAt: -1 });

  return sendSuccess(res, { data: bookings });
}

async function createBooking(req, res) {
  const location = {
    address: req.body.location.address,
    latitude: Number(req.body.location.latitude),
    longitude: Number(req.body.location.longitude)
  };
  const nearbyMechanics = await findNearbyMechanics(location, { maxDistanceKm: 20, limit: 12 });
  const nearestMatch = nearbyMechanics[0];
  const priceEstimate = estimatePrice({
    issueType: req.body.issueType,
    vehicleType: req.body.vehicleType,
    distanceKm: nearestMatch?.distanceKm || 0
  });

  const booking = await Booking.create({
    bookingCode: generateBookingCode(),
    customer: req.user._id,
    serviceCategory: req.body.serviceCategory,
    issueType: req.body.issueType,
    vehicleType: req.body.vehicleType,
    problemDescription: req.body.problemDescription,
    customerLocation: location,
    requestedMechanics: nearbyMechanics.map((entry) => entry.mechanic._id),
    priceEstimate,
    distanceKm: nearestMatch?.distanceKm || 0,
    etaMinutes: nearestMatch?.etaMinutes || 0,
    status: "requested",
    timeline: [
      {
        status: "requested",
        note: "Customer created the rescue request",
        actorType: "customer",
        actorId: req.user._id,
        at: new Date()
      }
    ]
  });

  const payment = await Payment.create({
    booking: booking._id,
    customer: req.user._id,
    amount: booking.priceEstimate,
    provider: "stripe",
    status: "pending"
  });

  await Chat.create({
    booking: booking._id,
    participants: [
      {
        participantId: req.user._id,
        role: "customer"
      }
    ]
  });

  const io = req.app.get("io");
  io.to(String(req.user._id)).emit("booking:new", booking);
  nearbyMechanics.forEach(({ mechanic, distanceKm, etaMinutes }) => {
    io.to(String(mechanic._id)).emit("booking:request", {
      bookingId: booking._id,
      bookingCode: booking.bookingCode,
      issueType: booking.issueType,
      vehicleType: booking.vehicleType,
      customerLocation: booking.customerLocation,
      distanceKm,
      etaMinutes,
      priceEstimate
    });
  });

  await createNotification(
    {
      recipientType: "user",
      recipientId: req.user._id,
      title: "Booking confirmed",
      body: `Your ${booking.issueType} request is now live.`,
      type: "booking"
    },
    io
  );

  await Promise.all(
    nearbyMechanics.map(({ mechanic, etaMinutes }) =>
      createNotification(
        {
          recipientType: "mechanic",
          recipientId: mechanic._id,
          title: "New nearby rescue request",
          body: `${booking.issueType} request available. ETA ${etaMinutes} minutes.`,
          type: "booking_request"
        },
        io
      )
    )
  );

  const createdBooking = await Booking.findById(booking._id)
    .populate("customer", "name phone vehicles")
    .populate("mechanic", "name phone averageRating vehicleTypes locationLabel");

  return sendSuccess(res, {
    statusCode: 201,
    data: {
      booking: createdBooking,
      payment,
      nearbyMechanicsCount: nearbyMechanics.length
    },
    message: "Booking created successfully"
  });
}

async function getBookingById(req, res) {
  const booking = await Booking.findById(req.params.id)
    .populate("customer", "name phone vehicles")
    .populate("mechanic", "name phone averageRating vehicleTypes locationLabel location");

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  ensureBookingAccess(req, booking);

  const payment = await Payment.findOne({ booking: booking._id }).sort({ createdAt: -1 });
  const review = await Review.findOne({ booking: booking._id }).sort({ createdAt: -1 });
  const chat = await Chat.findOne({ booking: booking._id });

  return sendSuccess(res, {
    data: {
      booking,
      payment,
      review,
      chat
    }
  });
}

async function updateBookingStatus(req, res) {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  ensureBookingAccess(req, booking);

  const nextStatus = req.body.status;
  const allowedNextStatuses = statusTransitions[booking.status] || [];
  if (!allowedNextStatuses.includes(nextStatus)) {
    throw new AppError(`Cannot change booking from ${booking.status} to ${nextStatus}`, 409);
  }

  if (req.accountType !== "mechanic" && nextStatus !== "cancelled") {
    throw new AppError("Customers can only cancel their booking", 403);
  }

  booking.status = nextStatus;
  if (req.body.finalCost !== undefined) {
    booking.finalCost = Number(req.body.finalCost);
  }
  if (nextStatus === "completed") {
    booking.completedAt = new Date();
    booking.paymentStatus = booking.paymentStatus === "paid" ? "paid" : booking.paymentStatus;
  }

  if (req.accountType === "mechanic") {
    booking.mechanicLocation = {
      latitude: req.user.location.coordinates[1],
      longitude: req.user.location.coordinates[0],
      address: req.user.locationLabel || ""
    };
  }

  addTimelineEntry(booking, {
    status: nextStatus,
    note: req.body.note || `Booking moved to ${nextStatus.replace("_", " ")}`,
    actorType: req.accountType === "mechanic" ? "mechanic" : "customer",
    actorId: req.user._id
  });

  await booking.save();

  if (nextStatus === "completed" && booking.mechanic) {
    const mechanic = await Mechanic.findById(booking.mechanic);
    if (mechanic) {
      const earningIncrement = booking.finalCost || booking.priceEstimate;
      mechanic.earnings.today += earningIncrement;
      mechanic.earnings.week += earningIncrement;
      mechanic.earnings.total += earningIncrement;
      mechanic.isAvailable = true;
      mechanic.availabilityStatus = "online";
      await mechanic.save();
    }
  }

  const io = req.app.get("io");
  io.to(`booking:${booking._id}`).emit("booking:status", booking);
  if (booking.customer) {
    io.to(String(booking.customer)).emit("booking:refresh", { bookingId: booking._id });
  }
  if (booking.mechanic) {
    io.to(String(booking.mechanic)).emit("booking:refresh", { bookingId: booking._id });
  }

  return sendSuccess(res, {
    data: booking,
    message: "Booking status updated"
  });
}

async function respondToBooking(req, res) {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    throw new AppError("Booking not found", 404);
  }

  if (booking.status !== "requested") {
    throw new AppError("This booking is no longer open for responses", 409);
  }

  const action = req.body.action;
  const mechanicId = String(req.user._id);

  if (action === "reject") {
    if (!booking.rejectedBy.map(String).includes(mechanicId)) {
      booking.rejectedBy.push(req.user._id);
      addTimelineEntry(booking, {
        status: booking.status,
        note: "Mechanic declined the request",
        actorType: "mechanic",
        actorId: req.user._id
      });
      await booking.save();
    }

    return sendSuccess(res, {
      data: booking,
      message: "Booking declined"
    });
  }

  if (!booking.requestedMechanics.map(String).includes(mechanicId)) {
    throw new AppError("This request was not assigned to your nearby queue", 403);
  }

  booking.mechanic = req.user._id;
  booking.status = "assigned";
  booking.acceptedAt = new Date();
  booking.distanceKm = calculateDistanceKm(booking.customerLocation, {
    latitude: req.user.location.coordinates[1],
    longitude: req.user.location.coordinates[0]
  });
  booking.etaMinutes = estimateEtaMinutes(booking.distanceKm);
  booking.mechanicLocation = {
    latitude: req.user.location.coordinates[1],
    longitude: req.user.location.coordinates[0],
    address: req.user.locationLabel || ""
  };
  addTimelineEntry(booking, {
    status: "assigned",
    note: "Mechanic accepted the request",
    actorType: "mechanic",
    actorId: req.user._id
  });
  await booking.save();

  req.user.isAvailable = false;
  req.user.availabilityStatus = "busy";
  await req.user.save();

  await Chat.findOneAndUpdate(
    { booking: booking._id },
    {
      $addToSet: {
        participants: {
          participantId: req.user._id,
          role: "mechanic"
        }
      }
    },
    { new: true }
  );

  const io = req.app.get("io");
  io.to(`booking:${booking._id}`).emit("booking:assigned", booking);
  io.to(String(booking.customer)).emit("booking:refresh", { bookingId: booking._id });
  io.to(String(req.user._id)).emit("booking:refresh", { bookingId: booking._id });

  await createNotification(
    {
      recipientType: "user",
      recipientId: booking.customer,
      title: "Mechanic assigned",
      body: `${req.user.name} accepted your rescue request.`,
      type: "booking"
    },
    io
  );

  const assignedBooking = await Booking.findById(booking._id)
    .populate("customer", "name phone vehicles")
    .populate("mechanic", "name phone averageRating vehicleTypes locationLabel location");

  return sendSuccess(res, {
    data: assignedBooking,
    message: "Mechanic assigned successfully"
  });
}

module.exports = {
  listBookings,
  createBooking,
  getBookingById,
  updateBookingStatus,
  respondToBooking
};
