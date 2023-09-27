const loadRoomHistory = async (room) => {
    const response = await fetch(`http://localhost:3001/roomHistory/${room}`);
    const data = await response.json();

    if (data.messageHistory) {
        return data.messageHistory;
    } else {
        return [];
    }
}

export {loadRoomHistory}