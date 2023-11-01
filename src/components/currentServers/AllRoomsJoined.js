import axios from 'axios'


const AllRoomsJoined = async (username) => {
  const PORT = process.env.REACT_APP_PORT;
  try {
    const roomsArray = await axios.get(
      `${PORT}/api/users/${username}/rooms`
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