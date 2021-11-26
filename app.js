const express = require("express");
const path = require("path");
const http = require('http');
const { Server } = require("socket.io");

// creating express app
const app = express();
// create a http server
const server = http.createServer(app);
// create socketio instance
const io = new Server(server);


// setting up template
app.use(express.static(path.join(__dirname, "public")));



// Run when client connects
io.on('connection', (socket) => {
    socket.emit('message', "Welcome to chat")

    socket.broadcast.emit("message", "A user has joined the chat.")


    socket.on("disconnect", () => {
        io.emit('message', "A user has left the chat.")
    })
});


// setting up port 
const PORT = 5000 || process.env.PORT;

// listening the server 
server.listen(PORT, () => console.log("listening..."));

