const env = require("../config/env");
const { sendError } = require("../utils/apiResponse");

function notFound(req, res, next) {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

function errorHandler(error, req, res, next) {
  const statusCode = error.statusCode || 500;
  const errors = error.errors || (env.nodeEnv === "development" ? error.stack : null);
  return sendError(res, {
    statusCode,
    message: error.message || "Internal server error",
    errors
  });
}

module.exports = {
  notFound,
  errorHandler
};
