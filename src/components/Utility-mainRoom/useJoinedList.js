import axios from 'axios';
import {useState, useEffect} from 'react';

const useJoinedList =()=>{

const [error,setError] = useState(null);
const [joinedListResponse, setJoinedListResponse ] = useState('')
const PORT = process.env.REACT_APP_PORT;

    const addRoom = async (username, roomNumber, roomName) =>{
        try{
            const sendData = await axios.post(`${PORT}/addRoomToUser`,{
                    username,
                    roomNumber,
                    roomName,
                });
            const response = sendData.data.message
            setJoinedListResponse(response);
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
            const response = sendData.data.message;
            setJoinedListResponse(response)
            return;
        }catch(err){
             setError("Error in removeRoom Helper: " + err);
        }
    }
    useEffect(()=>{

        console.log(joinedListResponse);

    },[joinedListResponse])

    return {addRoom, error,removeRoom, setJoinedListResponse , joinedListResponse}
}
export default useJoinedList;