const { sendError } = require("../utils/apiResponse");

function validate(validator) {
  return (req, res, next) => {
    const result = validator(req);
    const errors = Array.isArray(result) ? result.filter(Boolean) : [];

    if (errors.length) {
      return sendError(res, {
        statusCode: 422,
        message: "Validation failed",
        errors
      });
    }

    return next();
  };
}

module.exports = validate;
