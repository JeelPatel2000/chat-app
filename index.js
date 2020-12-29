const express = require("express");
const path = require("path");
const http = require("http");

var app = express();
const server = http.createServer(app);
var io = require("socket.io")(server);
// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Run when a client connects
io.on("connection", (socket) => {
	//Welcome current user
	socket.emit("message", "Welcome to chat!");

	//Broadcast when a user connects
	socket.broadcast.emit("message", "A user had joined a chat");

	socket.on("disconnect", () => {
		io.emit("message", "A user has left the chat");
	});
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
