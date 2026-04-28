const mongoose = require("mongoose");
const env = require("./env");

async function connectDB() {
  if (!env.mongoUri) {
    console.error("MongoDB URI not configured. Set MONGODB_URI environment variable.");
    process.exit(1);
  }
  
  if (!env.mongoUri.startsWith("mongodb://") && !env.mongoUri.startsWith("mongodb+srv://")) {
    console.error("Invalid MongoDB URI. Must start with 'mongodb://' or 'mongodb+srv://'");
    process.exit(1);
  }
  
  try {
    await mongoose.connect(env.mongoUri);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

module.exports = connectDB;
