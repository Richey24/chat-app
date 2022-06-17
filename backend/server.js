const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { 
    cors: {
        origin: "http://127.0.0.1:5500"
      }
 });
const port = process.env.PORT || 5000

io.on("connection", (socket) => {
  socket.on("newMessage", (message)=> {
    socket.broadcast.emit("message",message)
  })
});

httpServer.listen(port);