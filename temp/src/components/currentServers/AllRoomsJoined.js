import axios from "axios";

const AllRoomsJoined = async (username) => {
  try {
    const roomsArray = await axios.get(
      `/api/users/${username}/rooms`
    );
    const data = roomsArray.data;
    
    return data ? data : [];
  } catch (error) {
    console.error("An error occurred:", error);
    return [];
  }
};
const getAllRoomsData = async (username) => {
  try {
    const allRoomsCreated = await axios.get(
      `/getAllRoomsUserCreated/${username}`
    );
    const roomData = allRoomsCreated.data;
   
    return roomData ? roomData : [];
  } catch (err) {
    console.error(
      "An error occured in AllRoomsJoined helper in current servers"
    );
    return [];
  }
};
const TryDeleteOne = async (roomId, roomNumber) => {
  if (!roomNumber) {
    console.error("No room number sent");
    return;
  }

  try {
   
    const deleteRequest = await axios.post(`/deleteSingleRoom`, {
      roomId,
      roomNumber,
    });

    const response = deleteRequest.data.message;
    console.log("Delete response:", response);
    return response;
  } catch (error) {
    console.error("Error in deleteOne:", error);
    // Throw the error if you want the calling function to handle it
    throw error;
  }
};
export { AllRoomsJoined, getAllRoomsData, TryDeleteOne };
