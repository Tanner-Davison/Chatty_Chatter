const {User, Rooms}= require('../Schemas');

module.exports = {

    joinRoom: async (io, socket, data) =>{
        console.log('LOOOOKKK AT ME BITCHES', data)
        if(data.room_number){
          console.log(data.room_number)
        }
        try {
          const all_rooms = await io.sockets.adapter.sids[socket.id];

          for (let room in all_rooms) {
            socket.leave(room);
          }
          if(data.room_number){
            socket.join(data.room_number)
          }
          socket.join(data.room);
          if(data.room_number){
            return {
              success:true,
              message: `${data.room_number} was joined with great success`,
              roomData: data
            }
          }else{

            return {
              success: true,
              message: `${data.username} joined room ${data.room}`,
            };
          }

        } catch (error) {
            console.error("Error joining room:", error);
            return {
            success: false,
            message: "An error occurred while joining the room",
          };
        }
    }
}