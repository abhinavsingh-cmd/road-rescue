const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const env = require("./config/env");
const connectDB = require("./config/db");
const initializeSocket = require("./socket");

// Crash logging
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err);
});

// Safe PORT fallback
const PORT = env.port || process.env.PORT || 5000;

async function bootstrap() {
  try {
    // MongoDB Connection
    await connectDB();
    console.log("MongoDB connected");

    const server = http.createServer(app);

    // Safe frontend URL fallback
    const allowedOrigin =
      env.frontendUrl ||
      process.env.FRONTEND_URL ||
      "*";

    const io = new Server(server, {
      cors: {
        origin: allowedOrigin,
        methods: ["GET", "POST", "PATCH"],
      },
    });

    app.set("io", io);

    try {
      initializeSocket(io);
      console.log("Socket initialized");
    } catch (socketError) {
      console.error("Socket initialization failed:", socketError);
    }

    server.listen(PORT, () => {
      console.log(`Road Rescue backend running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Failed to start server:", error);
  }
}

bootstrap();