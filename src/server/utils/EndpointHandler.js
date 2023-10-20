const {Rooms} = require("./Schemas");

module.exports = {
  roomHistory: async (req, res) => {
    const room = await Rooms.findOne({ room_number: req.params.room });
    room
      ? res.status(200).json(room)
      : res.status(404).json({ message: "Room not Found" });
  },
  
};
