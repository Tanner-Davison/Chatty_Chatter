const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const EndpointHandler = require("./utils/EndpointHandler");
const LoginHelper = require("./utils/LoginHelper");
const { Rooms, User } = require("./utils/Schemas");
const connectDB = require("./utils/db");
const mongoose = require("mongoose");
mongoose.set("debug", true);

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use((req, res, next) => {
  console.log("Request body:", req.body);
  console.log("Request files:", req.files); // For multiple file uploads
  console.log("Request file:", req.file); // For single file upload
  next();
});
require("dotenv").config();
const MONGO_DB_KEY = process.env.MONGO_DB_KEY;
const PORT_ = process.env.PORT_;
app.use(express.urlencoded({ extended: true }));

//create Server
const server = http.createServer(app);
//connect to mongoDB
connectDB(MONGO_DB_KEY);

app.get("/roomHistory/:room", EndpointHandler.roomHistory);
app.get("/user_info/:username", EndpointHandler.userInfo);
app.get("/api/users/:username/rooms", EndpointHandler.joinedRooms);
app.post("/signup", LoginHelper.signUp);
app.post("/login", LoginHelper.Login);

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
    try {
      // Leaving other rooms first
      const rooms = io.sockets.adapter.sids[socket.id];
      for (let room in rooms) {
        socket.leave(room);
      }
      socket.join(data.room);

      console.log(`${data.username} joined room ${data.room}`);

      // Find the user
      const user = await User.findOne({
        username: data.username.toLowerCase(),
      });
      if (!user) {
        console.log(`No user found with username: ${data.username}`);
        return;
      }

      // Check if the user has been in this room before
      const inRoomPrev = user.roomsJoined.some((r) => String(r.room) === String(data.room));

      if (!inRoomPrev) {
        // If the user has never been in this room, add it
        await User.findOneAndUpdate(
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
        console.log(`Room ${data.room} added to ${data.username}`);
      }

      // Check if room has messages
      const roomHasMessages = await Rooms.findOne({
        room_number: data.room,
        "messageHistory.1": { $exists: true },
      });

      if (inRoomPrev) {
        console.log(`User ${data.username} has been in this room before`);
      } else if (!roomHasMessages) {
        console.log("Messages don't exist in this room");
      }

      // Check if the room exists
      let existingRoom = await Rooms.findOne({ room_number: data.room });

      if (existingRoom) {
        if (!existingRoom.users_in_room.includes(data.username)) {
          existingRoom.users_in_room.push(data.username);
          await existingRoom.save();
          console.log(`Added ${data.username} to room ${data.room}`);
        }
      } else {
        console.log("The room does not exist yet.");
      }
    } catch (err) {
      console.error("Error processing join_room:", err);
    }
  });

  socket.on("send_message", async (data) => {
    try {
      const messageAdded = await User.findOneAndUpdate(
        { username: data.username },
        { $set: { messages: data.message } },
        { new: true, useFindAndModify: false }
      );
      await messageAdded.save();

      let room = await Rooms.findOne({ room_number: data.room });

      if (!room) {
        // Create new room if it doesn't exist
        room = new Rooms({
          room_number: data.room,
          sent_by_user: messageAdded._id, // Assuming messageAdded is the User document
          username: data.username,
          message: data.message,
          users_in_room: [data.username],
        });
        await room.save();
        room.messageHistory.push({
          message: data.message,
          sentBy: data.username,
          timestamp: data.timestamp,
          imageUrl: data.imageUrl,
          cloudinary_id: data.cloudinary_id,
        });
        await room.save();
         socket.to(data.room).emit("receive_message", data);

        // Add this room to the user's list of rooms joined
        await User.findOneAndUpdate(
          { _id: messageAdded._id },
          {
            $push: {
              roomsJoined: {
                room: data.room,
                timestamp: new Date(),
              },
            },
          },
          { new: true, useFindAndModify: false }
        );
      } else {
        // Room exists, add message to messageHistory
        if (messageAdded) {
          room.messageHistory.push({
            message: data.message,
            sentBy: data.username,
            timestamp: data.timestamp,
            imageUrl: data.imageUrl,
            cloudinary_id: data.cloudinary_id,
          });
          await room.save();
        }
        socket.to(data.room).emit("receive_message", data);
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
