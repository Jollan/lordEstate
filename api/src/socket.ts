import { Server } from "socket.io";

function ioFlow(io: Server) {
  io.on("connection", (socket) => {
    socket.on("joinRoom", (userId) => {
      socket.join(userId);
    });

    socket.on("messageSent", ({ correspondentId, data }) => {
      io.to(correspondentId).emit("messageReceived", data);
    });

    socket.on("messageRead", ({ correspondentId, data }) => {
      io.to(correspondentId).emit("messageRead", data);
    });
  });
}

export = ioFlow;
