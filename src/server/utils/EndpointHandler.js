const {Rooms,User} = require("./Schemas");

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
        res.json({roomsJoined:userList.roomsJoined,
        roomsCreated:userList.roomsCreated});
      }
    } catch (err) {
      console.log(err);
    }
  },
  roomAvailable: async (req,res) =>{
    try{
        const roomToCheck = req.params.numberValue;
          const result = await Rooms.findOne({
            room_number: roomToCheck
          })
          if(result){
            res.status(200).json({room: true})
          }else if(!result){
            res.status(200).json({room: false})
          }
    }catch (error){
      console.log(error);
      
    }
  }

  
};