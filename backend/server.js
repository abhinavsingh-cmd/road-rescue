const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const env = require("./config/env");
const connectDB = require("./config/db");
const initializeSocket = require("./socket");

const PORT = env.port;

async function bootstrap() {
  try {
    await connectDB();
    console.log("MongoDB connected");

    const server = http.createServer(app);
    const io = new Server(server, {
      cors: {
        origin: env.frontendUrl,
        methods: ["GET", "POST", "PATCH"]
      }
    });

    app.set("io", io);
    initializeSocket(io);

    server.listen(PORT, () => {
      console.log(`Road Rescue backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

bootstrap();
