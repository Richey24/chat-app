const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://127.0.0.1:5500",
  },
});
const port = process.env.PORT || 5000;
const allMessage = {};

io.on("connection", (socket) => {
  socket.on("newMessage", (message, userId) => {
    if (userId in allMessage) {
      allMessage[userId].push(message);
    } else {
      allMessage[userId] = [];
      allMessage[userId].push(message);
    }
    socket.to(userId).emit("message", allMessage[userId]);
  });
  socket.on("noti", (link, username) => {
    socket.to(link).emit("noti", username);
  });
  socket.on("link", (link) => {
    socket.join(link);
  });
  socket.on("get-message", (id, userId) => {
    console.log(id, userId);
    socket.to(id).emit("message", allMessage[userId]);
  });
  socket.on("join-room", (userId) => {
    socket.join(userId);
  });
});

httpServer.listen(port);
