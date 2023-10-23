const {User, Rooms} = require('./Schemas')


module.exports ={
 updateUsersMessage: async (data) =>{
    try{
        const updatedUser = await User.findOneAndUpdate(
          { username: data.username },
          { $set: { messages: data.message } },
          { new: true, useFindAndModify: false }
        )
        updatedUser && updatedUser.save();
        return updatedUser || null;

    } catch (error){
        console.log('error in updateUser.js', error)
    }

},
    findRoom: async (data)=>{
        const roomExist = await Rooms.findOne({
            room_number: data
        });
         return roomExist || null; 
    },
    findUserAndRoom: async (data)=>{
        const userExist = await User.findOne({
            username: data.username
        })
        const messagesExist = await Rooms.findOne({
            "messageHistory.1": {$exists:true}
        })
        const inRoomPrev = await userExist.roomsJoined.some((r)=> String(r.room) === String(data.room));
        
        inRoomPrev &&
          User.findOneAndUpdate(
            { username: data.username },
            {
    $push: {
            roomsJoined: {
            room: parseInt(data.room, 10),
            timestamp: data.timestamp,
                },
            },
        },
        { new: true, useFindAndModify: false }
        );
        console.log(`Room ${data.room} added to ${data.username}`);

      return userExist ? {
        userFound: true,
        inRoomPrev: inRoomPrev,    //give a value of true or false;
        hasMessages: messagesExist //gives a value of true or false;
        }: 
        {userFound: false,
        inRoomPrev: false,
        hasMessages:messagesExist 
        };
    },
}
