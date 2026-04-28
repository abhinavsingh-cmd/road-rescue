function successResponse({ data = null, message = "Success", meta = null } = {}) {
  return {
    success: true,
    message,
    data,
    meta
  };
}

function errorResponse({ message = "Something went wrong", errors = null, code = null } = {}) {
  return {
    success: false,
    message,
    errors,
    code
  };
}

function sendSuccess(res, { statusCode = 200, data = null, message = "Success", meta = null } = {}) {
  return res.status(statusCode).json(successResponse({ data, message, meta }));
}

function sendError(res, { statusCode = 400, message = "Something went wrong", errors = null, code = null } = {}) {
  return res.status(statusCode).json(errorResponse({ message, errors, code }));
}

module.exports = {
  successResponse,
  errorResponse,
  sendSuccess,
  sendError
};
