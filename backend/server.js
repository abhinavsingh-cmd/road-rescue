const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const env = require("./config/env");
const connectDB = require("./config/db");
const initializeSocket = require("./socket");

async function bootstrap() {
  await connectDB();

  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: env.frontendUrl,
      methods: ["GET", "POST", "PATCH"]
    }
  });

  app.set("io", io);
  initializeSocket(io);

  server.listen(env.port, () => {
    console.log(`Road Rescue backend running on port ${env.port}`);
  });
}

bootstrap();
