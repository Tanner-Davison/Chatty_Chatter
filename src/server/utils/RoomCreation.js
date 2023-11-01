const { User, Rooms } = require("./Schemas");
const currentDate = new Date().toLocaleDateString(); 
module.exports = {
  createPublic: async (req, res) => {
    console.log('running');
    try{

        const user = await User.findOne({
            username: req.body.createdBy
        });
        const existingRoom = await Rooms.findOne({
            room: req.body.room,
        })
        if(existingRoom){
            return res.status(404).send({message: 'room already exists'})
        }
        if(user){
            const room = new Rooms({
              room_number: req.body.room,
              room_name: req.body.publicRoomName,
              private_room: false,
              created_by: req.body.createdBy,
              room_category: req.body.category,
              first_message: `Created! on ${currentDate}.`,
              messageHistory: {
                message: `Room Created By ${req.body.createdBy} on ${currentDate}`,
                sentBy: req.body.createdBy,
                timestamp: currentDate,
                imageUrl: req.body.imageUrl,
                cloudinary_id: req.body.cloudinary,
              },
              users_in_room: [req.body.createdBy],
            });
             await room.save();
            console.log('room created');
            user.roomsCreated.push({
                roomName: req.body.publicRoomName,
                room: req.body.room,
                private: false,
                timestamp: currentDate,
            })
            await user.save();
            res.status(200).send({message: 'room created'});
            console.log(`${req.body.createdBy} created room ${req.body.publicRoomName}`);
        }
        
    }catch (err){
        console.log(err)
    }
  },
};
