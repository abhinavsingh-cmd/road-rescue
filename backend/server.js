
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err);
});

console.log("STEP 1: Starting server...");

const http = require("http");
console.log("STEP 2: HTTP loaded");

const { Server } = require("socket.io");
console.log("STEP 3: Socket.IO loaded");

const app = require("./app");
console.log("STEP 4: App loaded");

const env = require("./config/env");
console.log("STEP 5: Env loaded");

const connectDB = require("./config/db");
console.log("STEP 6: DB config loaded");

const initializeSocket = require("./socket");
console.log("STEP 7: Socket initializer loaded");

const PORT = env.port || process.env.PORT || 5000;

async function bootstrap() {
  try {
    console.log("STEP 8: Connecting MongoDB...");

    await connectDB();
    console.log("STEP 9: MongoDB connected");

    const server = http.createServer(app);

    const allowedOrigin =
      env.frontendUrl ||
      process.env.FRONTEND_URL ||
      "*";

    const io = new Server(server, {
      cors: {
        origin: allowedOrigin,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true,
      },
    });

    app.set("io", io);

    try {
      initializeSocket(io);
      console.log("STEP 10: Socket initialized");
    } catch (socketError) {
      console.error("Socket initialization failed:", socketError);
    }

    server.listen(PORT, () => {
      console.log(`Road Rescue backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error("FAILED TO START SERVER:", error);
  }
}

bootstrap();
