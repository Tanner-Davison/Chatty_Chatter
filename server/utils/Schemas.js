const mongoose = require("mongoose");
const { Schema } = mongoose;
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  message: String,
  profilePic: {
    url: String,
    cloudinary_id: String,
  },
  sentMessages: [
    {
      message: String,
      room: Number,
      timestamp: String,
    },
  ],
  roomsJoined: [
    {
      room: Number,
      roomName: String,
      timestamp: String,
    },
  ],
  roomsCreated: [
    {
      roomName: String,
      room: Number,
      roomPassword: Number,
      private: Boolean,
      timestamp: String,
    },
  ],
  friends: [
    {
      type: String,
    },
  ],
  profileBio: {
    String,
  },
  education: {
    String,
  },
  profession: {
    String,
  },
});

const roomSchema = new mongoose.Schema({
  room_number: {
    type: Number,
  },
  room_name: {
    type: String,
  },
  private_room: {
    type: Boolean,
  },
  private_room_password: {
    type: String,
  },
  created_by: {
    type: String,
    required: true,
  },
  room_category: {
    type: String,
  },
  first_message: {
    type: String,
  },
  messageHistory: [
    {
      message: String,
      sentBy: String,
      timestamp: String,
      imageUrl: String,
      cloudinary_id: String,
    },
  ],
  users_in_room: [String],
});

const Rooms = mongoose.model("Rooms", roomSchema);
const User = mongoose.model("User", userSchema);
module.exports = {
  Rooms,
  User,
};
