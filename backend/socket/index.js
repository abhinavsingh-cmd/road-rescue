function initializeSocket(io) {
  io.on("connection", (socket) => {
    socket.on("join:user", (userId) => {
      socket.join(String(userId));
    });

    socket.on("join:booking", (bookingId) => {
      socket.join(`booking:${bookingId}`);
    });

    socket.on("booking:update", ({ bookingId, payload }) => {
      io.to(`booking:${bookingId}`).emit("booking:status", payload);
    });

    socket.on("chat:message", ({ bookingId, message }) => {
      io.to(`booking:${bookingId}`).emit("chat:message", message);
    });

    socket.on("mechanic:location", ({ bookingId, payload }) => {
      io.to(`booking:${bookingId}`).emit("mechanic:location", payload);
    });
  });
}

module.exports = initializeSocket;
