import { io } from "socket.io-client";

let socket;

export function getSocket() {
  if (!socket && typeof window !== "undefined") {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000", {
      transports: ["websocket", "polling"],
      autoConnect: true
    });
  }

  return socket;
}
