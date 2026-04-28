const path = require("path");
const dotenv = require("dotenv");
const fs = require("fs");

const envPath = path.join(__dirname, "..", ".env");
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

function getMongoUri() {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri === "mongodb://localhost:27017/road_rescue") {
    return process.env.MONGODB_URI || "mongodb://localhost:27017/road_rescue";
  }
  return uri;
}

module.exports = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: process.env.PORT || 5000,
  mongoUri: getMongoUri(),
  jwtSecret: process.env.JWT_SECRET || "replace-with-a-strong-secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || "",
  googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || ""
};
