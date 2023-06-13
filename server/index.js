const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoute = require("./routes/userRoute");
const messagesRoute = require("./routes/messagesRoute");
const app = express();
/*
Socket.IO allows bi-directional communication between client and server. 
Bi-directional communications are enabled when a client has Socket.IO in the browser,
 and a server has also integrated the Socket.IO package.
 {
    "version": 2,
    "builds": [
        {
            "src": "./index.js",
            "use": "@vercel/node"
        }
    ],
    "routes": [
        {
            "src": "/.*",
            "dest": "index.js"
        }
    ]
}
*/
const socket = require("socket.io");

require("dotenv").config();
// const http = require("http");
app.use(cors());
app.use(express.json());
//connected with the routes
app.use("/api/auth", userRoute);
app.use("/api/msg", messagesRoute);

//serving the frontend
// app.use(express.static(path.join(__dirname, "../public/build")));

// app.get("*", function (_, res) {
// 	res.sendFile(
// 		path.join(__dirname, "../public/build/index.html"),
// 		function (err) {
// 			res.status(500).send(err);
// 		}
// 	);
// });

//connection stablish btw DB
mongoose
	.connect(process.env.MONGO_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("DB connection established");
	})
	.catch((error) => {
		console.log("DB is not connected", error);
	});

const PORTs = process.env.PORT || 5000;
const server = app.listen(PORTs, (err) => {
	if (err) {
		console.log(`Server is not connected`);
	}
	console.log(`Server is connected at port ${PORTs}`);
});

//io is created
const io = socket(server, {
	cors: {
		origin: process.env.ORIGIN,
		credentials: true,
	},
});

//now creating nodejs global object
//we store all user online in this map
global.onlineUsers = new Map();

//first we make the connection
// when ever we hit connection
//we store the chatSocket inside the global chatSocket
//now when ever we emit, add user from the client side
// when ever the user is logged in will stablish the socket connection
// build connection by add user
// will grab the userId and the current socket id and will set it inside
// map n
io.on("connection", (socket) => {
	global.chatSocket = socket;
	socket.on("add-user", (userId) => {
		onlineUsers.set(userId, socket.id);
	});

	socket.on("send-msg", (data) => {
		const sendUserSocket = onlineUsers.get(data.to);
		if (sendUserSocket) {
			socket.to(sendUserSocket).emit("msg-receive", data.message);
		}
	});
});
