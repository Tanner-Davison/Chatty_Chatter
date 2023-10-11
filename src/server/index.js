
const express = require("express");
const app = express();
const http = require("http");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require('multer')
const storage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: {
		folder: "some_folder_name", // The name of the folder in Cloudinary
		allowedFormats: ["jpg", "png"],
	},
});
const parser = multer({ storage: storage });
require("dotenv").config();

console.log(process.env.MONGO_DB_KEY);
const MONGO_DB_KEY = process.env.MONGO_DB_KEY;
app.use(cors());

const server = http.createServer(app);

async function connect() {
	try {
		await mongoose.connect(MONGO_DB_KEY);
		console.log("Connected To MongoDB");
	} catch (err) {
		console.log(err);
	}
}
connect();
const CLOUDINARY_URL = process.env.CLOUDINARY_URL;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUD_NAME = process.env.CLOUD_NAME;
cloudinary.config({
	cloud_name: CLOUD_NAME,
	api_key: CLOUDINARY_API_KEY,
	api_secret: CLOUDINARY_URL,
});

app.get("/roomHistory/:room", async (req, res) => {
	const room = await Rooms.findOne({ room_number: req.params.room });
	if (room) {
		res.json(room);
	} else {
		res.status(404).json({ message: "Room not Found" });
	}
});
app.post("/upload", parser.single("image"), async (req, res) => {
	const { username,password /*... any other user details like password, email etc. */ } =
		req.body;
	const image = {
		url: req.file.url,
		cloudinary_id: req.file.public_id,
	};

	try {
		// Check if user already exists
		const existingUser = await User.findOne({ username: username });
		if (existingUser) {
			return res.status(400).send("Username already exists.");
		}

		// Create new user
		const newUser = new User({
			username: username,
            profileImage: image,
            passwordl: password,
			// ... set any other user details here
		});

		await newUser.save();

		res.json({ message: "User registered successfully!", image });
	} catch (error) {
		res.status(500).send("Error registering user.");
	}
});
const messagesSchema = new mongoose.Schema({
	serverUserID: {
		type: String,
		required: true,
	},
	username: {
		type: String,
		required: true,
	},
    message: String,
    profileImage: {
        url: String,
        cloudinary_id: String,
    }
});

const roomSchema = new mongoose.Schema({
	room_number: {
		type: Number,
		required: true,
	},
	sent_by_user: {
		type: mongoose.Schema.Types.ObjectId, // Using ObjectId for referencing
		ref: "Message", // reference to the Message model
		required: true,
	},
	username: {
		type: String,
		required: true,
	},
	message: {
		type: String,
	},
	messageHistory: [
		{
			message: String,
			sentBy: String,
			timestamp: String,
		},
	],
	users_in_room: [String],
});

const Rooms = mongoose.model("Rooms", roomSchema);
const User = mongoose.model("User", messagesSchema);

const io = new Server(server, {
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST", "DELETE"],
	},
});

let numUsers = 0;
io.on("connection", (socket) => {
	console.log(`Server Connected on:${socket.id}`);

	numUsers++;
	console.log({ Active_Users: numUsers });

	socket.on("user_info", async (data) => {
		User.findOne({ serverUserID: socket.id }).then((user) => {
			if (!user) {
				const user = new User({
					serverUserID: `${socket.id}`,
					username: `${data.username}`,
					messages: "",
				});
				user.save();
			}
		});
	});
	socket.on("join_room", async (data) => {
		const rooms = io.sockets.adapter.sids[socket.id];
		for (let room in rooms) {
			socket.leave(room);
		}

		socket.join(data.room);

		User.findOne({ username: data.username }).then((user) => {
			if (!user) {
				console.log(`No user found with username: ${data.username}`);
				return;
			}
			Rooms.findOne({ room_number: data.room }).then((existingRoom) => {
				if (existingRoom) {
					if (!existingRoom.users_in_room.includes(data.username)) {
						existingRoom.users_in_room.push(data.username);
						existingRoom
							.save()
							.then(() =>
								console.log(`Added user ${data.username} to room ${data.room}`)
							)
							.catch((err) => console.error("Error adding user to room:", err));
					}
				} else {
					const room = new Rooms({
						room_number: data.room,
						sent_by_user: user._id,
						username: data.username,
						message: data.message,
						users_in_room: [data.username],
					});

					room
						.save()
						.then(() => {
							console.log(`Room created successfully @ ${room.room_number}`);
						})
						.catch((err) => console.log("Error creating room", err));
				}
			});
		});
	});

	socket.on("send_message", async (data) => {
		// Notice the 'async' keyword here
		socket.to(data.room).emit("receive_message", data);

		console.log({
			USER_MESSAGE: `User ${socket.id} sent ${data.message} to room ${data.room} @${data.timestamp}`,
		});

		try {
			const updatedPerson = await User.findOneAndUpdate(
				{ serverUserID: socket.id },
				{ $set: { messages: data.message } },
				{ new: true, useFindAndModify: false }
			);
			console.log("Updated Person", data.username);

			const room = await Rooms.findOne({ room_number: data.room });
			if (room) {
				room.messageHistory.push({
					message: data.message,
					sentBy: data.username,
					timestamp: data.timestamp,
				});
				await room.save();
			}
		} catch (err) {
			console.error("Error updating Person", err);
		}
	});
	socket.on("leaveroom", async (data) => {
		if (!socket) {
			return;
		}
		socket.disconnect();
		console.log("disconnected");
		numUsers--;
	});

	socket.on("deleteRoom", async (data) => {
		const roomOwner = await Rooms.findOne({
			room_number: data.room,
			username: data.username,
		});
		if (roomOwner) {
			console.log("_id", roomOwner._id);
			await Rooms.deleteOne({ _id: roomOwner._id });
			socket.disconnect();
			return console.log(`Room deleted Successfully @ ${data.room}`);
		}
		const searchPerson = await Rooms.findOne({
			room_number: `${data.room}`,
			users_in_room: `${data.username}`,
		});
		if (searchPerson) {
			await Rooms.updateOne(
				{ room_number: `${data.room}`, users_in_room: `${data.username}` },
				{ $pull: { users_in_room: `${data.username}` } }
			);
			console.log({
				USER_DELETED: `User ${data.username} data has been deleted from the room`,
			});
		} else {
			console.log({
				ERROR: `No user found in room with username: ${data.username}`,
			});
		}
		socket.disconnect();
		User.collection.drop();
		Rooms.collection.drop();
	});

	socket.on("reconnection_attempt", () => {
		console.log("recconection attempted");
	});

	socket.on("reconnect", () => {
		console.log("Connection Restored.");
	});
});

server.listen(3001, () => {
	console.log("Server is running");
});
