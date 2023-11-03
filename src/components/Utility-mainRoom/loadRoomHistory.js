const loadRoomHistory = async (room) => {
 console.log(room)
  const response = await fetch(`http://localhost:3001/roomHistory/${room}`);
  const data = await response.json();

  if (data.messageHistory) {
    console.log(data);
    return { messageHistory: data.messageHistory, private: data.private_room, allRoomData:data};
  } else {
    return [];
  }
};

export { loadRoomHistory };
