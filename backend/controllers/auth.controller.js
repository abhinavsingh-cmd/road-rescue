const User = require("../models/User");
const Mechanic = require("../models/Mechanic");
const generateToken = require("../utils/generateToken");
const AppError = require("../utils/appError");
const { sendSuccess } = require("../utils/apiResponse");

async function signup(req, res) {
  const { name, email, phone, password, role } = req.body;
  const isMechanic = role === "mechanic";
  const Model = isMechanic ? Mechanic : User;

  const existing = await Model.findOne({ email });
  if (existing) {
    throw new AppError("Email already registered", 409);
  }

  const account = await Model.create({
    name,
    email,
    phone,
    password,
    ...(isMechanic ? { availabilityStatus: "offline", isAvailable: true } : { role: "customer" })
  });

  const token = generateToken({
    id: account._id,
    role: isMechanic ? "mechanic" : account.role,
    accountType: isMechanic ? "mechanic" : "user"
  });

  return sendSuccess(res, {
    statusCode: 201,
    data: { [isMechanic ? "mechanic" : "user"]: account, token },
    message: "Account created successfully"
  });
}

async function login(req, res) {
  const { email, password, role } = req.body;
  const isMechanic = role === "mechanic";
  const Model = isMechanic ? Mechanic : User;

  const account = await Model.findOne({ email });
  if (!account || !(await account.comparePassword(password))) {
    throw new AppError("Invalid credentials", 401);
  }

  const token = generateToken({
    id: account._id,
    role: isMechanic ? "mechanic" : account.role,
    accountType: isMechanic ? "mechanic" : "user"
  });

  return sendSuccess(res, {
    data: { [isMechanic ? "mechanic" : "user"]: account, token },
    message: "Login successful"
  });
}

async function me(req, res) {
  const profile = req.user.toJSON();
  if (req.accountType === "mechanic") {
    profile.role = "mechanic";
  }
  return sendSuccess(res, { data: profile });
}

async function updateProfile(req, res) {
  const updates = req.body || {};
  const isMechanic = req.accountType === "mechanic";

  const forbiddenFields = ["password", "email", "role", "earnings", "averageRating"];
  forbiddenFields.forEach((field) => delete updates[field]);

  if (isMechanic) {
    if (updates.location?.latitude && updates.location?.longitude) {
      updates.location = {
        type: "Point",
        coordinates: [Number(updates.location.longitude), Number(updates.location.latitude)]
      };
      updates.lastLocationUpdatedAt = new Date();
    }
  }

  Object.assign(req.user, updates);
  await req.user.save();

  const freshProfile = req.user.toJSON();
  if (isMechanic) freshProfile.role = "mechanic";

  return sendSuccess(res, {
    data: freshProfile,
    message: "Profile updated successfully"
  });
}

module.exports = {
  signup,
  login,
  me,
  updateProfile
};
