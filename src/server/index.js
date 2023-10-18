const express = require("express");
const app = express();
const http = require("http");
const mongoose = require("mongoose");
mongoose.set("debug", true);
const { Server } = require("socket.io");
const cors = require("cors");
const bcrypt = require("bcrypt");
const saltRounds = 5;
const jwt = require("jsonwebtoken");
const authenticateUser = require('./utils/auth')
const {Rooms,User}= require('./utils/User_schema');
const connectDB = require("./utils/db");
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use((req, res, next) => {
  console.log("Request body:", req.body);
  console.log("Request files:", req.files); // For multiple file uploads
  console.log("Request file:", req.file); // For single file upload
  next();
});
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "profile_photos", // The name of the folder in Cloudinary
    // allowedFormats: ["jpg", "png"],
  },
});

const parser = multer({ storage: storage });
require("dotenv").config();
const MONGO_DB_KEY = process.env.MONGO_DB_KEY;
const PORT_ = process.env.PORT_;
app.use(express.urlencoded({ extended: true }));

//create Server
const server = http.createServer(app);
//connect to mongoDB
connectDB(MONGO_DB_KEY);

const CLOUDINARY_URL = process.env.CLOUDINARY_URL;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
// const CLOUD_NAME = process.env.CLOUD_NAME;
const CLOUDINARY_SECRET = process.env.CLOUDINARY_SECRET;
cloudinary.config({
  cloud_name: "dezclgtpg",
  api_key: "833978376411799",
  api_secret: CLOUDINARY_SECRET,
});

app.get("/roomHistory/:room", async (req, res) => {
  const room = await Rooms.findOne({ room_number: req.params.room });
  if (room) {
    res.status(200).json(room);
  } else {
    res.status(404).json({ message: "Room not Found" });
  }
});
app.get("/user_info/:sessionUsername", async (req, res) => {
  console.log(`sent from app.get/sessionUsername`, req.params.username);
  const user = await User.findOne({ username: req.params.username });
  if (user) {
    console.log("User was found successfully!");
    res.json(user);
  } else {
    res.status(404).json({ message: "User not Found" });
  }
});
app.get("/api/users/:username/rooms", async (req, res) => {
  try {
    const username = req.params.username;
    const userList = await User.findOne({ username: username });
    if (!userList) {
      res.status(404).json({ message: "user list is not found" });
    } else {
      res.json(userList.roomsJoined);
    }
  } catch (err) {
    console.log(err);
  }
});
app.post("/signup", parser.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded. No image found");
  }
  console.log("Received FormData:", {
    username: req.body.username,
    password: req.body.password,
    file: req.file,
  });
  const { username, password } = req.body;

  const image = {
    url: req.file.path,
    cloudinary_id: req.file.filename,
  };

  try {
    const existingUser = await User.findOne({
      username: username.toLowerCase(),
    });

    if (existingUser) {
      return res.status(404).json({ message: "user exist please login." });
    } else {
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);

      const createNewUser = new User({
        username: username.toLowerCase(),
        password: hashedPassword,
        profilePic: {
          url: image.url,
          cloudinary_id: image.cloudinary_id,
        },
      });
      await createNewUser.save();
      res.status(200).json({ message: "User created!", image, hashedPassword });
    }
  } catch (error) {
    console.error("Error registering user:", error.existingUser.data);
    res.status(500).send("Error registering user.");
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const result = await authenticateUser(username, password);

  if (result === "INVALID PASSWORD") {
    res.status(401).send("Invalid password");
  } else if (result === "USER NOT FOUND") {
    res.status(404).send("User not found");
  } else if (result === "INTERNAL SERVER ERROR") {
    res.status(500).send("Internal Server Error");
  } else {
    // Authentication was successful, proceed with your logic
    res.status(200).send(result);
  }
});


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

  socket.on("join_room", async (data) => {
    const rooms = io.sockets.adapter.sids[socket.id];
    for (let room in rooms) {
      socket.leave(room);
    }
    // leaves all rooms that user is connected to.
    socket.join(data.room);

    console.log(`${data.username} joined room ${data.room}`);
    try {
      const user = await User.findOne({
        username: data.username.toLowerCase(),
      });
      const inRoomPrev = await User.findOne({
        username: data.username,
        "roomsJoined.room": data.room,
      });
      console.log(`Looook here HEEERRREEE`, typeof data.room);
      if (user && inRoomPrev) {
        console.log(`user ${data.username} has been in this room before`);
      } else if (user && !inRoomPrev) {
        console.log("type of room number", typeof data.room);
        const updateUser = await User.findOneAndUpdate(
          { username: data.username },
          {
            $push: {
              roomsJoined: {
                room: parseInt(data.room, 10),
                timestamp: data.timestamp,
              },
            },
          },
          { new: true, useFindAndModify: false }
        );
      }
      console.log(`room ${data.room} added to ${data.username}`);
      if (!user) {
        console.log(`No user found with username: ${data.username}`);
      }

      // BELOW CHECKS IF THE ROOM EXISTS
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
    console.log(data.imageUrl || data.message);
    try {
      await User.findOneAndUpdate(
        { username: data.username },
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
          imageUrl: data.imageUrl,
          cloudinary_id: data.cloudinary_id,
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
                timestamp: data.timestamp,
              },
            },
          },
          { new: true, useFindAndModify: false }
        );
        socket.to(data.room).emit("receive_message", data);
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
