require("dotenv").config({ path: "../.env" });

const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
const cors = require("cors");
const EndpointHandler = require("./utils/EndpointHandler");
const LoginHelper = require("./utils/LoginHelper");
const dbController = require("./utils/dbController");
const socketController = require("./utils/socketUtils/socketController");
const RoomCreation = require("./utils/RoomCreation");
const { Rooms, User } = require("./utils/Schemas");
const connectDB = require("./db");
const mongoose = require("mongoose");
mongoose.set("debug", true);

// Access environment variables after dotenv has been loaded
const DATABASE_URL = process.env.DATABASE_URL;
const PORT = process.env.PORT;

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use((req, res, next) => {
  console.log("Request body:", req.body);
  console.log("Response Data", res.data);
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, "../build")));
// Create Server
const server = http.createServer(app);

// Connect to MongoDB
connectDB(DATABASE_URL);

app.get("/roomHistory/:room", EndpointHandler.roomHistory);
app.get("/user_info/:username", EndpointHandler.userInfo);
app.get("/api/users/:username/rooms", EndpointHandler.joinedRooms);
app.get(
  "/getAllRoomsUserCreated/:username",
  EndpointHandler.getAllCurrentUsersRoomsCreated
);
app.get("/availability/:numberValue", EndpointHandler.roomAvailable);
app.get("/searchByNameFinder/:searchName", dbController.searchByRoomName);
app.get("/password_check/", EndpointHandler.verifyPrivateRoomPassword);
app.get("/get_all_rooms", EndpointHandler.getAllRooms);
app.get("/checkUsersJoinedList", EndpointHandler.checkUsersJoinedList);
app.get(
  "/checkUsersJoinedListOnLoad",
  EndpointHandler.checkUsersJoinedListOnLoad
);
app.post("/new-room-creation", RoomCreation.createPublic);
app.post("/create-private-room", RoomCreation.createPrivate);
app.post("/signup", LoginHelper.signUp);
app.post("/login", LoginHelper.Login);
app.post("/addRoomToUser", EndpointHandler.addRoomToUser);
app.post("/removeJoinedRoom", EndpointHandler.removeJoinedRoom);
app.post("/deleteSingleRoom", EndpointHandler.deleteSingleRoom);
app.post("/updateUserProfile", EndpointHandler.updateProfileVariables);
app.post("/addFriend", EndpointHandler.addFriend);
app.post("/checkIfFriends", EndpointHandler.checkIfAlreadyFriend);

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});
const io = new Server(server, {
  cors: {
    origin: "https://localhost:3000",
    methods: ["GET", "POST", "DELETE"],
  },
  reconnection: true,
  reconnectionAttempts: 200,
  reconnectionDelay: 2000,
});

io.on("connection", (socket) => {
  socket.recovered
    ? console.log(
        "Recovery was successful: socket.id, socket.rooms, and socket.data were restored"
      )
    : console.log("New or unrecoverable session.");
  console.log(
    `${socket.id} connected successfully. SOCKET CONNECTED: ${socket.connected}`
  );

  socket.on("join_room", async (data) => {
    const userExist = await dbController.findUserAndRoom(data);
    console.log("JOIN ROOM DATA");
    const inRoomPrev = userExist.inRoomPrev;
    const roomHasMessages = userExist.hasMessages;
    console.log(data, "console.logging here");
    if (!userExist) {
      return console.log("No user found.");
    }
    try {
      const joinResult = await socketController.joinRoom(io, socket, data);

      if (joinResult.success) {
        console.log(joinResult.message);
      } else {
        console.log(joinResult.message); // If joinResult was falsey
      }
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
      await dbController.updateUsersMessage(data);
      let room = await dbController.findRoom(data.room);

      if (!room) {
        // Initialize room object and messageHistory in one go
        room = new Rooms({
          room_number: data.room,
          created_by: data.username,
          first_message: data.message,
          users_in_room: [data.username],
          messageHistory: [
            {
              message: data.message,
              sentBy: data.username,
              timestamp: data.timestamp,
              imageUrl: data.imageUrl,
              cloudinary_id: data.cloudinary_id,
            },
          ],
        });
        await room.save(); // Single save operation
      } else {
        // Append message to existing room
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
    } catch (err) {
      console.error("Error in send_message:", err);
    }
  });

  socket.on("typing", (data) => {
    socket.to(data.room).emit("sender_is_typing", data.username);
    console.log(data.username);
  });

  socket.on("leaveroom", async (data) => {
    if (!socket) {
      return;
    }
    socket.disconnect();
    console.log("Disconnected");
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
      return console.log(`Room deleted successfully @ ${data.room}`);
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
    console.log("Reconnection attempt");
  });

  socket.on("reconnect", () => {
    console.log("Connection Restored.");
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
