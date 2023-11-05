import axios from 'axios'

const PORT = process.env.REACT_APP_PORT;

const AllRoomsJoined = async (username) => {
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
const getAllRoomsData = async (username) =>{
  try{
    const allRoomsCreated = await axios.get(`${PORT}/getAllRoomsUserCreated/${username}`);
    const roomData = allRoomsCreated.data;
    console.log(roomData)
    return roomData ? roomData : [];
  }catch(err){
    console.error("An error occured in AllRoomsJoined helper in current servers")
    return [];
  }
}
export { AllRoomsJoined , getAllRoomsData};