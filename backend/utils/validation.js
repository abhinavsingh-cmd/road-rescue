function isEmpty(value) {
  return value === undefined || value === null || value === "";
}

function required(value, field, message = `${field} is required`) {
  if (isEmpty(value)) {
    return { field, message };
  }

  return null;
}

function email(value, field = "email") {
  if (isEmpty(value)) {
    return { field, message: "Email is required" };
  }

  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
  return ok ? null : { field, message: "Enter a valid email address" };
}

function minLength(value, length, field) {
  if (isEmpty(value)) {
    return { field, message: `${field} is required` };
  }

  return String(value).trim().length >= length
    ? null
    : { field, message: `${field} must be at least ${length} characters long` };
}

function isNumber(value, field, message = `${field} must be a number`) {
  return Number.isFinite(Number(value)) ? null : { field, message };
}

function isBoolean(value, field, message = `${field} must be a boolean`) {
  return typeof value === "boolean" ? null : { field, message };
}

function coordinates(location, field = "location") {
  if (!location || typeof location !== "object") {
    return { field, message: "Location is required" };
  }

  const latitude = Number(location.latitude);
  const longitude = Number(location.longitude);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return { field, message: "Location must contain valid latitude and longitude" };
  }

  return null;
}

module.exports = {
  required,
  email,
  minLength,
  isNumber,
  isBoolean,
  coordinates
};
