const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

// creating the server
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  // configuring cors origin
  cors: {
    origin: "https://brave-ocean-0db6b1310.1.azurestaticapps.net",
  },
});

const port = process.env.PORT || 5000;
// creating an object to hold previous messages
const allMessage = {};

io.on("connection", (socket) => {
  socket.on("newMessage", (message, userId) => {
    if (userId in allMessage) {
      allMessage[userId].push(message); // putting the user message inside its array in the object
    } else {
      // creating an array for the user message if there is none and putting the message in
      allMessage[userId] = [];
      allMessage[userId].push(message);
    }
    // sending a message to only user in the room joined by the userId
    io.to(userId).emit("message", allMessage[userId], userId);
  });
  // notification handler
  socket.on("noti", (link, username) => {
    // sending the notification to the user in the room
    socket.to(link).emit("noti", username);
  });
  socket.on("link", (link) => {
    // linking user for notification
    socket.join(link);
  });
  socket.on("get-message", (userId) => {
    // getting all the user previous message in the array inside the object
    socket.emit("message1", allMessage[userId]);
  });
  socket.on("join-room", (userId) => {
    // joining user in a room for private messaging
    socket.join(userId);
  });
});

httpServer.listen(port);
