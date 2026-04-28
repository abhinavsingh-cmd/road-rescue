const jwt = require("jsonwebtoken");
const env = require("../config/env");
const User = require("../models/User");
const Mechanic = require("../models/Mechanic");
const { sendError } = require("../utils/apiResponse");

async function resolvePrincipal(decoded) {
  if (decoded.accountType === "mechanic") {
    return Mechanic.findById(decoded.id);
  }

  return User.findById(decoded.id);
}

async function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendError(res, { statusCode: 401, message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, env.jwtSecret);
    const principal = await resolvePrincipal(decoded);

    if (!principal) {
      return sendError(res, { statusCode: 401, message: "Account no longer exists" });
    }

    req.user = principal;
    req.accountType = decoded.accountType || "user";
    return next();
  } catch (error) {
    return sendError(res, { statusCode: 401, message: "Invalid or expired token" });
  }
}

function authorize(...roles) {
  return (req, res, next) => {
    const role = req.accountType === "mechanic" ? "mechanic" : req.user?.role;

    if (!roles.includes(role)) {
      return sendError(res, { statusCode: 403, message: "Forbidden" });
    }

    return next();
  };
}

module.exports = {
  protect,
  authorize
};
