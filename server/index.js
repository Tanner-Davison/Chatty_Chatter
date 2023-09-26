const express = require("express");
const app = express();
const http = require("http");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const cors = require("cors");

const url =
  "mongodb+srv://tboydavison:Luliann465$@gendervsgender.iid016a.mongodb.net/";

app.use(cors());

const server = http.createServer(app);

async function connect() {
  try {
    await mongoose.connect(url);
    console.log("Connected To MongoDB");
  } catch (err) {
    console.log(err);
  }
}
connect();

app.get("/roomHistory/:room", async (req, res) => {
  const room = await Rooms.findOne({ room_number: req.params.room });
  if (room) {
    res.json(room);
  } else {
    res.status(404).json({ message: "Room not Found" });
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
  console.log(`User Connected:${socket.id}`);
  numUsers++;
  console.log({ NUMBEROFUSERS: numUsers });

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
    socket.join(data.room);

    User.findOne({ username: data.username }).then((user) => {
      if (!user) {
        console.log(`No user found with username: ${data.username}`);
        return;
      }
      const room = new Rooms({
        room_number: data.room,
        sent_by_user: user._id,
        username: data.username,
        message: data.message,
      });

      room
        .save()
        .then(() => {
          console.log(`Room created successfully @ ${room.room_number}`);
        })
        .catch((err) => console.log("Error creating room", err));
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
      console.log("Updated Person", updatedPerson);

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
  socket.on("leave", async (data) => {
    socket.disconnect();
    User.collection.drop();
    Rooms.collection.drop();
    numUsers--;
    // Fetch the user details before deleting
    const searchPerson = await User.findOne({
      serverUserID: `${socket.id}`,
    });
    if (searchPerson) {
      console.log({
        USER_DISCONNECTED: `USERNAME ${searchPerson.username} (${socket.id}) Disconnected from Room: ${data}`,
        USERS_REMAINING: numUsers,
      });
      // Delete the user's data from the collection
      await User.deleteOne({ serverUserID: `${socket.id}` });
      console.log({
        USER_DELETED: `User ${socket.id} data has been deleted from the database`,
      });
    } else {
      console.log({ ERROR: `No user found with ID ${socket.id}` });
    }
  });
});

server.listen(3001, () => {
  console.log("Server is running");
});
