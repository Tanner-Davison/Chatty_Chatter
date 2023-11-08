import axios from 'axios';
import {useState, useEffect} from 'react';

const useJoinedList =()=>{

const [error,setError] = useState(null);
const [joinedListResponse, setJoinedListResponse ] = useState('')
const PORT = process.env.REACT_APP_PORT;

   const checkJoinedRoomList = async (username, roomToCheck) => {
     try {
       const response = await axios.get(`${PORT}/checkUsersJoinedList`, {
         params: { username, roomToCheck }, // Use params to send data in the request
       });
       return response.data;
     } catch (err) {
       setError("found error in useJoinedList" + err);
       return null; // or handle the error in an appropriate way
     }
   };
    const addRoom = async (username, roomNumber, roomName) =>{
        try{
            const sendData = await axios.post(`${PORT}/addRoomToUser`,{
                    username, 
                    roomNumber, 
                    roomName,
                });
            const response = sendData.data
            if(response.message){

                setJoinedListResponse(response.message);
            }else if(response.room){
                console.log("did not receive a message body in return.");
                
            }
            console.log(joinedListResponse)
            return 
        }catch(err){
             setError("Error in AddRoom Helper: " + err);
        }
    }
    const removeRoom = async(username,roomNumber, roomName) =>{
        try{
            const sendData = await axios.post(`${PORT}/removeJoinedRoom`,
            {
                username,
                roomNumber,
                roomName,
            });
            const response = await sendData.data.message;
            setJoinedListResponse(response)
            return;
        }catch(err){
             setError("Error in removeRoom Helper: " + err);
        }
    }
    useEffect(()=>{

        console.log(joinedListResponse);
        console.log(error)
    },[joinedListResponse, error])

    return {addRoom, error,removeRoom, setJoinedListResponse , joinedListResponse, checkJoinedRoomList}
}
export default useJoinedList;