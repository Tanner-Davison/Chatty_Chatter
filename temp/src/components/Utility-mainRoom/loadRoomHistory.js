const loadRoomHistory = async (room) => {
  try {
    const response = await fetch(`/roomHistory/${room}`);
    const data = await response.json();

    if (data.messageHistory) {
      return {
        messageHistory: data.messageHistory,
        private: data.private_room,
        allRoomData: data,
      };
    } else {
      // Handle the case where the room doesn't exist or there is no message history
      return { messageHistory: [], private: false, allRoomData: {} };
    }
  } catch (error) {
    console.error("An error occurred while loading room history:", error);
    return { messageHistory: [], private: false, allRoomData: {} };
  }
};

export { loadRoomHistory };
