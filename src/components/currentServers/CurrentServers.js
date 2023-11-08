import "./CurrentServer.css";
import { useContext, useEffect, useState } from "react";
import { LoginContext } from "../contexts/LoginContext";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import { AllRoomsJoined } from "./AllRoomsJoined.js";
import PublicRoomsCreated from './RoomOptions/PublicRoomsCreated'
import PrivateRoomsCreated from "./RoomOptions/PrivateRoomsMade";
import RoomsToExplore from "./RoomOptions/RoomsToExplore";
import FollowingList from './RoomOptions/FollowingList.js'
const CurrentServers = () => {
  const { setMainAccess, setSocket, socket, userLoginInfo } =
    useContext(LoginContext);
  const navigate = useNavigate();
  const doesUserExist = JSON.parse(sessionStorage.getItem("username"));
  const [roomsJoined, setRoomsJoined] = useState([]);
  const mainRoom = 1;
  const [newUserToggle, setNewUserToggle] = useState(true);
  const [roomsCreated, setRoomsCreated] = useState([]);
  const PORT = process.env.REACT_APP_PORT;

  const displayRooms = async () => {
    if (doesUserExist) {
      const allRooms = await AllRoomsJoined(
        doesUserExist ? doesUserExist : userLoginInfo.username
      );
      setRoomsJoined(allRooms.roomsJoined);
      setRoomsCreated(allRooms.roomsCreated);
      
      console.log(allRooms.roomsJoined.length);
      
      if (allRooms.roomsJoined.length > 0 || allRooms.roomsCreated.length > 0) {
        setNewUserToggle(false);
      }
    }
  };
  const handleRoomButtonClick = (roomNumber) => {
    setMainAccess(true);
    setSocket(io.connect(`${PORT}`), {
      reconnection: true,
      reconnectionAttempts: 20,
      reconnectionDelay: 2000,
    });
    sessionStorage.setItem("lastRoom", roomNumber.toString());
    return navigate(`/chatroom/${roomNumber}`);
  }; 

  useEffect(() => {
  

    displayRooms();
    console.log(roomsJoined);

    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Header
        socket={socket}
        handleRoomButtonClick={handleRoomButtonClick}
      />
      <div className={`room-container`}>
        {newUserToggle && <h1>Enter main room to get started!</h1>}
        <div
          className={
            newUserToggle ? `main-room-wrapper new-user` : "main-room-wrapper"
          }>
          <button
            className={"main-room-button"}
            onClick={() => handleRoomButtonClick(mainRoom)}>
            <p> Public - Room </p>
          </button>
        </div>

        {
          <>
            <FollowingList
              key={roomsJoined._id + "143"}
              handleCLick={handleRoomButtonClick}
              roomsCreated={roomsJoined}
            />
          </>
        }
      </div>
      {
        <PublicRoomsCreated
          key={roomsCreated._id + "16"}
          handleClick={handleRoomButtonClick}
          roomsCreated={roomsCreated}
        />
      }
      {
        <PrivateRoomsCreated
          key={roomsCreated._id + "12"}
          handleClick={handleRoomButtonClick}
          roomsCreated={roomsCreated}
        />
      }
      {
        <RoomsToExplore
          key={roomsCreated._id + "1"}
          handleClick={handleRoomButtonClick}
          roomsCreated={roomsCreated}
        />
      }
    </>
  );
};
export default CurrentServers;
