const {Rooms,User} = require("./Schemas");
const bcrypt = require('bcrypt');
const currentDate = new Date().toLocaleDateString(); 
module.exports = {
  roomHistory: async (req, res) => {
    const room = await Rooms.findOne({ room_number: req.params.room });
    room
      ? res.status(200).json(room)
      : res.status(404).json({ message: "Room not Found" });
  },

  userInfo: async (req, res) => {
    console.log(
      `sent from user_info function endpoint handler`,
      req.params.username
    );
    const user = await User.findOne({ username: req.params.username });
    if (user) {
      console.log("User was found successfully!");
      res.json(user);
    } else {
      res.status(404).json({ message: "User not Found" });
    }
  },

  joinedRooms: async (req, res) => {
    try {
      const username = req.params.username;
      const userList = await User.findOne({ username: username });
      if (!userList) {
        res.status(404).json({ message: "user list is not found" });
      } else {
        res.json({
          roomsJoined: userList.roomsJoined,
          roomsCreated: userList.roomsCreated,
        });
      }
    } catch (err) {
      console.log(err);
    }
  },
  roomAvailable: async (req, res) => {
    try {
      const roomToCheck = req.params.numberValue;
      const result = await Rooms.findOne({
        room_number: roomToCheck,
      });
      if (result) {
        res.status(200).json({ room: true });
      } else if (!result) {
        res.status(200).json({ room: false });
      }
    } catch (error) {
      console.log(error);
    }
  },

  verifyPrivateRoomPassword: async (req, res) => {
    const { password, room, roomPassword, username, roomName } = req.query;
    console.log(password, room, roomPassword);
    const joinRoom = await User.findOne({username: username})
    const passwordMatch = await bcrypt.compare(password, roomPassword);
    if (passwordMatch) {
       if(joinRoom){
      joinRoom.roomsJoined.push({
        room: room,
        roomName:roomName,
        timeStamp: currentDate,
      })
      await joinRoom.save();
      return res.status(200).send({ message: "success" });
    }else if(!joinRoom){
      return console.log('failed veryify private Password at joinroom does not exit check backend please')
    }
    } else {
      return res.status(404).send({ message: "failed" });
    }
  },
  getAllRooms: async (req, res) => {
    const rooms = req.query.rooms;

    // Ensure rooms is an array
    if (!Array.isArray(rooms)) {
      return res.status(400).json({ error: "Invalid query parameter" });
    }

    try {
      // Find rooms where the room_name is not in the rooms array
      const result = await Rooms.find({ room_number: { $nin: rooms } });

      // Send the result to the client
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: "Database error" });
    }
  },
  getAllCurrentUsersRoomsCreated: async (req, res) => {
    try {
      const username = req.params.username;
      console.log(username);
      const userRoomList = await Rooms.find({ created_by: username });
      if (!userRoomList) {
        res.status(404).json({ message: "user list is not found" });
      } else {
        console.log(userRoomList);
        res.json({
          roomsCreatedByUser: userRoomList,
        });
      }
    } catch (err) {
      console.log(err);
    }
  },
  deleteSingleRoom: async (req, res) => {
    console.log(req.body);
    try {
      const roomId = req.body.roomId;
      const roomNumber = req.body.roomNumber;

      const deletedRoom = await Rooms.findOneAndDelete({ _id: roomId });

      if (deletedRoom) {
        const result = await User.updateOne(
          { "roomsCreated.room": roomNumber },
          { $pull: { roomsCreated: { room: roomNumber } } }
        );
      } 
    } catch (error) {
      console.log(`error at deleteSingleRoom: ${error}`);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};