const mongoose = require('mongoose')
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
      timestamp: String,
    },
  ],
  friends:[
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

const roomSchema = new mongoose.Schema({
  room_number: {
    type: Number,
    required: true,
  },
  sent_by_user: {
    type: mongoose.Schema.Types.ObjectId, // Using ObjectId for referencing
    ref: "User", // reference to the Message model
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
    User
};
