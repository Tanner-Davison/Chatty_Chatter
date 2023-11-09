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
    const joinRoom = await User.findOne({ username: username });
    const passwordMatch = await bcrypt.compare(password, roomPassword);
    if (passwordMatch) {
      if (joinRoom) {
        joinRoom.roomsJoined.push({
          room: room,
          roomName: roomName,
          timeStamp: currentDate,
        });
        await joinRoom.save();
        return res.status(200).send({ message: "success" });
      } else if (!joinRoom) {
        return console.log(
          "failed veryify private Password at joinroom does not exit check backend please"
        );
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
  try {
    const { roomId, roomNumber } = req.body;

    // Delete room from the Rooms collection
    const deletedRoom = await Rooms.deleteOne({ room_number: roomNumber });

    if (deletedRoom.deletedCount > 0) {
      console.log('ROOM SUPPOSEDLY DELETED')
      // Room was deleted successfully, continue with other logic

      // Example: Delete the room from the User collection
      const result = await User.updateOne(
        { "roomsCreated.room": roomNumber },
        { $pull: { roomsCreated: { room: roomNumber } } }
      );

      // Check if the user was updated successfully
      if (result) {
        return res.status(200).json({ message: 'Room was deleted and successfully removed from the user.' });
      } else {
        return res.status(500).json({ message: 'Room deleted, but user update failed.' });
      }
    } else {
      // Room not found or not deleted successfully
      return res.status(404).json({ message: 'Room not found.' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
},
  checkUsersJoinedList: async (req, res) => {
    const username = req.query.username;
    const roomToCheck = req.query.roomToCheck;

    if (username && roomToCheck) {
      try {
        await User.findOne(
          { username: username },
          { "roomsJoined.room": roomToCheck }
        )
          .then((user) => {
            console.log("user Found in roomJoinedList ", user);
            const filteredRooms = user.RoomsJoined.filter(
              (room) => Object.keys(room).length > 0
            );

            if (!filteredRooms) {
              console.log(user.roomsJoined + user.roomsJoined);
              res.status(200).send({ message: false });
            } else if (filteredRooms) {
              console.log(user.roomsJoined);
              res.status(200).send({ message: true });
            }
          })
          .catch((err) => console.error(err + "inside the .then .catch(block"));
      } catch (err) {
        console.error(err + "checkUsersJoinedList error in try catch block");
      }
    }
  },
  checkUsersJoinedListOnLoad: async (req, res) => {
    const username = req.query.username;
    const roomToCheck = req.query.roomToCheck;
    const roomNumber = req.query.roomNumber;
    if (username && roomToCheck) {
      try {
        await User.findOne(
          { username: username },
          { "roomsJoined.room_name": roomToCheck , 'roomsJoined.room': roomNumber }
        )
          .then((user) => {
            console.log("user Found in roomJoinedList ", user);
            const filteredRooms = user.RoomsJoined.filter(
              (room) => Object.keys(room).length > 0
            );

            if (!filteredRooms) {
              console.log(user.roomsJoined + user.roomsJoined);
              res.status(200).send({ message: false });
            } else if (filteredRooms) {
              console.log(user.roomsJoined);
              res.status(200).send({ message: true });
            }
          })
          .catch((err) => console.error(err + "inside the .then .catch(block"));
      } catch (err) {
        console.error(err + "checkUsersJoinedList error in try catch block");
      }
    }
  },
  addRoomToUser: async (req, res) => {
    try {
      const username = req.body.username;
      const room = req.body.roomNumber;
      const roomName = req.body.roomName;

      if (username && room) {
        const findUser = await User.findOne({ username: username });

        if (!findUser) {
          console.log("User not found.");
          return res.status(404).send({ message: "User not found." });
        }

        const alreadyJoinedRoom = await User.findOne({
          "roomsJoined.room": room,
        });

        if (alreadyJoinedRoom) {
          console.log("User has already joined this room.");
          return res
            .status(200)
            .send({ message: "User has already joined this room." });
        }
        if (findUser) {
          findUser.roomsJoined.push({
            room: room,
            roomName: roomName,
            timeStamp: currentDate,
          });
          await findUser.save();
        }
        console.log("User joined the room successfully.");
        return res
          .status(200)
          .send({ message: "User joined the room successfully." });
      } else {
        console.log("Username or room number is missing in the request.");
        return res.status(400).send({
          message: "Username or room number is missing in the request.",
        });
      }
    } catch (error) {
      console.log("Backend error at addRoomToUser in EndpointHandler:", error);
      return res.status(500).send({ message: "Internal server error." });
    }
  },
  removeJoinedRoom: async (req, res) => {
    const username = await req.body.username;
    const room = await req.body.roomNumber;
    const roomName = await req.body.roomName;

    if (username && room && roomName) {
      try {
        const user = await User.findOne({
          "roomsJoined.room": room,
        });
        if (!user) {
          return res.status(404).send({
            message: "user could not find applicable room to remove",
          });
        } else {
          await user.updateOne(
            { $pull: { roomsJoined: { room: room } } },
            { multi: true }
          );
          await user.save();
          return res.status(200).send({
            message: "room was removed successfully",
          });
        }
      } catch (err) {
        console.error(err);
      }
    }
  },
};