const {User, Rooms}= require('../Schemas');

module.exports = {

    joinRoom: async (io, socket, data) =>{
        
        try {
          const all_rooms = await io.sockets.adapter.sids[socket.id];

          for (let room in all_rooms) {
            socket.leave(room);
          }
          
          socket.join(data.room);
          
          return {
            success: true,
            message: `${data.username} joined room ${data.room}`,
          };

        } catch (error) {
            console.error("Error joining room:", error);
            return {
            success: false,
            message: "An error occurred while joining the room",
          };
        }
    }
}