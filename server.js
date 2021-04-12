const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const { format } = require("path");

const app = express();

const server = http.createServer(app);

const io = socketio(server);

//Set static folder
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {

    //Welcome current user
    socket.emit("message", formatMessage("Gupshup Bot", "Welcome To GupShup!"));
    //Broadcast when a user connects
    socket.broadcast.emit(
      "message",
      formatMessage("Gupshup Bot", "A user has joined the chat")
    );
  });

  //Listen for chat message
  socket.on("chatMessage", (msg) => {
    io.emit("message", formatMessage("USER", msg));
  });

  //Broadcast when user disconnects
  socket.on("disconnect", () => {
    io.emit(
      "message",
      formatMessage("Gupshup Bot", "A user has left the chat")
    );
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});
