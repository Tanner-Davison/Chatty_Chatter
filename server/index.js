const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST", "DELETE", ""],
	},
});
numUsers = 0;
const tellLogged = () => {
	console.log({Remaining_Logged_Users: numUsers});
}
io.on("connection", (socket) => {
	console.log(`User Connected:${socket.id}`);
	numUsers += 1
	
    console.log({USERS_LOGGED_IN: numUsers});
	socket.on("join_room", (data) => {
		socket.join(data);
	});
	socket.on("send_mesage", (data) => {
        socket.to(data.room).emit("receive_message", data);
        
		console.log({
			USER_MESSAGE: `User ${socket.id} sent ${data.message} from room ${data.room}`,
		});
    });
    socket.on('leave', (data) => {
        socket.disconnect();
		numUsers--
        console.log({ USER_DISCONNECTED: `USER ${socket.id} Disconnected from Room: ${data}`})
		tellLogged();
    })
});

server.listen(3001, () => {
	console.log("Server is running");
});
