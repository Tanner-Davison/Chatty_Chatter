import axios from 'axios'


const AllRoomsJoined = async (username) => {
  try {
    const roomsArray = await axios.get(
      `http://localhost:3001/api/users/${username}/rooms`
    );
    const data = roomsArray.data;
    console.log(data);
    return data ? data : [];
  } catch (error) {
    console.error("An error occurred:", error);
    return [];
  }
};

export { AllRoomsJoined };