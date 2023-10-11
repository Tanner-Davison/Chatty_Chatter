
const express = require("express");
const app = express();
const http = require("http");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require('multer')
const storage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: {
		folder: "profile_photos", // The name of the folder in Cloudinary
		// allowedFormats: ["jpg", "png"],
	},
});

const parser = multer({ storage: storage });
require("dotenv").config();

console.log(process.env.MONGO_DB_KEY);
const MONGO_DB_KEY = process.env.MONGO_DB_KEY;
const PORT_= process.env.PORT_
app.use(express.urlencoded({ extended: true }));
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
// const CLOUDINARY_URL = process.env.CLOUDINARY_URL;
// const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
// const CLOUD_NAME = process.env.CLOUD_NAME;
// const CLOUDINARY_SECRET = process.env.CLOUDINARY_SECRET;
cloudinary.config({
  cloud_name: "dezclgtpg",
  api_key: "833978376411799",
  api_secret: "nNz10mGYYDAGdsbOq50YrK6GpLg",
});

app.get("/roomHistory/:room", async (req, res) => {
	const room = await Rooms.findOne({ room_number: req.params.room });
	if (room) {
		res.json(room);
	} else {
		res.status(404).json({ message: "Room not Found" });
	}
});
app.get('/user_info/:sessionUsername',async (req,res)=>{
	const user = await User.findOne({username: req.params.username});
	if(user){
		console.log('User was found successfully!')
		res.json(user);
	} else{
		res.status(404).json({message: "User not Found"})
	}
})
app.post("/upload", parser.single("image"), async (req, res) => {
	console.log(req.file.url)
	const { username,password } =
		req.body;
		
	const image = {
		url: req.file.url,
		cloudinary_id: req.file.public_id,
	};

	try {
		// Check if user already exists
		const existingUser = await User.findOne({ username: username });
		
		if (existingUser) {
			console.log(existingUser);
			return res.status(400).send("Username already exists.");
		}

		// Create new user
		const newUser = new User({
			username: username,
            password: password,
            profileImage: image,
			// ... set any other user details here
		});

		await newUser.save();

		res.json({ message: "User registered successfully!", image });
	} catch (error) {
		console.error("Error registering user:", error);
		res.status(500).send("Error registering user.");
	}
});
const messagesSchema = new mongoose.Schema({
	
	username: {
		type: String,
		required: true,
	},
    message: String,
    profileImage: {
        url: String,
        cloudinary_id: String,
    },
	sentMessages:[
		{
			message: String,
			room:Number,
			timestamp: String
		}
	],
	roomsJoined:[
		{
			room:Number,
			timestamp:String,
		}
	]
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
		
	});
	socket.on("join_room", async (data) => {
    const rooms = io.sockets.adapter.sids[socket.id];
    for (let room in rooms) {
      socket.leave(room);
    }

    socket.join(data.room);
    console.log(socket.rooms, socket.id);

    try {
      const user = await User.findOne({ username: data.username });

      if (!user) {
        console.log(`No user found with username: ${data.username}`);
        return;
      }

      let existingRoom = await Rooms.findOne({ room_number: data.room });

      if (existingRoom) {
        if (!existingRoom.users_in_room.includes(data.username)) {
          existingRoom.users_in_room.push(data.username);
          await existingRoom.save();
          console.log(`Added user ${data.username} to room ${data.room}`);
        }
      } else {
        const room = new Rooms({
          room_number: data.room,
          sent_by_user: user._id,
          username: data.username,
          message: data.message,
          users_in_room: [data.username],
        });

        await room.save();
        console.log(`Room created successfully @ ${room.room_number}`);
      }
    } catch (err) {
      console.error("Error processing join_room:", err);
    }
  });

	socket.on("send_message", async (data) => {
		// Notice the 'async' keyword here
		socket.to(data.room).emit("receive_message", data);

		console.log({
			USER_MESSAGE: `User ${socket.id} sent ${data.message} to room ${data.room} @${data.timestamp}`,
		});

		try {
			const updatedPerson = await User.findOneAndUpdate(
				{ username: data.username},
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
			    try {
        // Save the message to the user's document
        await User.findOneAndUpdate(
            { username: data.username },
            {
                $push: {
                    sentMessages: {
                        message: data.message,
                        room: data.room,
                        timestamp: data.timestamp
                    }
                }
            },
            { new: true, useFindAndModify: false }
        );

        // ... rest of the code
    } catch (err) {
        console.error("Error saving message to user:", err);
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

server.listen(PORT_, () => {
	console.log(`Server is running on ${PORT_}`);
});
