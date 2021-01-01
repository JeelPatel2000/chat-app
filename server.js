const express = require("express");
const path = require("path");
const http = require("http");
var app = express();
const server = http.Server(app);
const io = require("socket.io")(server);
const {v4: uuidv4} = require("uuid");

app.set("view engine", "ejs");

// Set static folder
app.use(express.static("public"));

app.get("/:roomID", (req, res) => {
	res.render("room", {data: {roomID: req.params.roomID}});
});

app.get("/", (req, res) => {
	res.redirect(`/${uuidv4()}`);
});

// Run when a client connects
io.on("connection", (socket) => {
	socket.on("join-room", (roomID, userID) => {
		socket.join(roomID);
		socket.to(roomID).broadcast.emit("user-connected", userID);
	});
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
