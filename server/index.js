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

const messagesSchema = new mongoose.Schema({
  serverUserID: String,
  username: String,
  messages: String,
  review: String,
});

const User = mongoose.model("User", messagesSchema);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "DELETE", ""],
  },
});

let numUsers = 0;
io.on("connection", (socket) => {
  console.log(`User Connected:${socket.id}`);
  numUsers++;
  console.log({ NUMBEROFUSERS: numUsers });

  socket.on("user_info", (data) => {
    const user = new User({
      serverUserID: `${socket.id}`,
      username: `${data.username}`,
      messages: "",
    });
    user.save();
  });

  socket.on("join_room", (data) => {
    socket.join(data);
  });
  socket.on("send_mesage", (data) => {
    socket.to(data.room).emit("receive_message", data);

    console.log({
      USER_MESSAGE: `User ${socket.id} sent ${data.message} to room ${data.room}`,
    });
    User.findOneAndUpdate(
      { serverUserID: socket.id },
      { $set: { messages: data.message } },
      { new: true, useFindAndModify: false }
    )
      .then((updatedPerson) => {
        console.log("Updated Person", updatedPerson);
      })
      .catch((err) => {
        console.error("Error updating Person", err);
      });
  });
  socket.on("leave", async (data) => {
    socket.disconnect();
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
