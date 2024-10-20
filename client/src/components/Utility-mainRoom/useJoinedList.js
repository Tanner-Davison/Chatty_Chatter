import axios from "axios";
import { useState, useEffect } from "react";

const useJoinedList = () => {

  const [error, setError] = useState(null);
  const [joinedListResponse, setJoinedListResponse] = useState("");

  const checkJoinedRoomList = async (username, roomToCheck) => {
    try {
      const response = await axios.get(
        `/checkUsersJoinedList`,
        {
          params: { username, roomToCheck }, // Use params to send data in the request
        }
      );
      setJoinedListResponse(response.data.message);
      return response.data.message;
    } catch (err) {
      setError("found error in useJoinedList" + err);
      return null; // or handle the error in an appropriate way
    }
  };
  const checkJoinedRoomListOnLoad = async (
    username,
    roomToCheck,
    roomNumber
  ) => {
    try {
      const response = await axios.get(
        `/checkUsersJoinedListOnLoad`,
        {
          params: { username, roomToCheck }, // Use params to send data in the request
        }
      );
      setJoinedListResponse(response.data.message);
      return response.data.message;
    } catch (err) {
      setError("found error in useJoinedList" + err);
      return null; // or handle the error in an appropriate way
    }
  };
  const addRoom = async (username, roomNumber, roomName) => {
 
    try {
      const sendData = await axios.post(
        `/addRoomToUser`,
        {
          username,
          roomNumber,
          roomName,
        }
      );
      const response = sendData.data;
      if (response.message) {
        setJoinedListResponse(response.message);
      } else if (response.room) {
        console.log("did not receive a message body in return.");
      }
    
      return;
    } catch (err) {
      setError("Error in AddRoom Helper: " + err);
    }
  };
  const removeRoom = async (username, roomNumber, roomName) => {
    try {
      const sendData = await axios.post(
        `/removeJoinedRoom`,
        {
          username,
          roomNumber,
          roomName,
        }
      );
      const response = await sendData.data.message;

      setJoinedListResponse(response);
      return response;
    } catch (err) {
      setError("Error in removeRoom Helper: " + err);
    }
  };
  useEffect(() => {
    console.log(joinedListResponse);
    console.log(error);
  }, [joinedListResponse, error]);

  return {
    addRoom,
    error,
    removeRoom,
    setJoinedListResponse,
    joinedListResponse,
    checkJoinedRoomList,
    checkJoinedRoomListOnLoad,
  };
};
export default useJoinedList;
