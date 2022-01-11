const express = require("express");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const { formatMessage } = require("./utils/message");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

// creating express app
const app = express();
// create a http server
const server = http.createServer(app);
// create socketio instance
const io = new Server(server);

const botName = "ChatCord";

// setting up template
app.use(express.static(path.join(__dirname, "public")));

// Run when client connects
io.on("connection", (socket) => {
  socket.on("joinChatRoom", ({ username, room }) => {
    const user = userJoin({ username, room, id: socket.id });

    socket.join(user.room);

    socket.emit("message", formatMessage(botName, "Welcome to chat"));

    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${username} has joined the chat.`)
      );

    // Send User and Room Info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // Listen for ChatMessage
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    if (user) {
      io.to(user.room).emit("message", formatMessage(user.username, msg));
    }
  });

  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} has left the chat.`)
      );

      // Send User and Room Info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

// setting up port
const PORT = 5000 || process.env.PORT;

// listening the server
server.listen(PORT, () => console.log("listening..."));
