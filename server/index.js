const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { CLIENT_RENEG_LIMIT } = require("tls");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST", "DELETE", ""],
	},
});
let numUsers = 0;
io.on("connection", (socket) => {
	console.log(`User Connected:${socket.id}`);
    numUsers++
    console.log({NUMBEROFUSERS: numUsers});
	socket.on("join_room", (data) => {
		socket.join(data);
	});
	socket.on("send_mesage", (data) => {
        socket.to(data.room).emit("receive_message", data);
        
		console.log({
			USER_MESSAGE: `User ${socket.id} sent ${data.message} to room ${data.room}`,
		});
    });
    socket.on('leave', (data) => {
        socket.disconnect();
        numUsers--
        console.log(
          {
            USER_DISCONNECTED: `USER ${socket.id} Disconnected from Room: ${data}`,
          },
          { USERS_REMAINING: numUsers }
        );

    })
});

server.listen(3001, () => {
	console.log("Server is running");
});
