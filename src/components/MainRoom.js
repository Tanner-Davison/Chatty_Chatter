import React, { useState, useEffect, useContext, useRef } from "react";
import { LoginContext } from "./contexts/LoginContext";
import "./MainRoom.css";
import "../App.css";
import { loadRoomHistory } from "./Utility-mainRoom/loadRoomHistory";
import getCurrentTime, { getCurrentTimeJSX } from "./Utility-mainRoom/getTime";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import Header from "./Header/Header";
import sendIcon from "./Utility-mainRoom/svgs/SendIcon.svg";
import { useIsTyping } from "./Utility-mainRoom/IsTyping.js";
import TypingComp from "./Utility-mainRoom/TypingComp";
import PrivateRoomAccess from "./Utility-mainRoom/PrivateRoomAccess.js";
import axios from "axios";
import useJoinedList from "./Utility-mainRoom/useJoinedList.js";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import IndeterminateCheckBoxOutlinedIcon from "@mui/icons-material/IndeterminateCheckBoxOutlined";
import ReplyRoundedIcon from "@mui/icons-material/ReplyRounded";
const MainRoom = () => {
  const { userLoginInfo, mainAccess, setMainAccess, socket, setSocket } =
    useContext(LoginContext);

  const [clicked, setClicked] = useState(false);
  const [message, setMessage] = useState("");
  const [messageRecieved, setMessageRecieved] = useState([]);
  const [roomData, setRoomData] = useState([]);
  const lastRoom = sessionStorage.getItem("lastRoom");
  const initialRoom = lastRoom ? parseInt(lastRoom, 10) : 1;
  const [room, setRoom] = useState(initialRoom);
  const [inRoom, setInroom] = useState(initialRoom);
  const sessionImage = sessionStorage.getItem("image-url");
  const sessionCloudinary_id = sessionStorage.getItem("cloudinary_id");
  const messagesStartRef = useRef(null);
  const PORT = process.env.REACT_APP_PORT;
  const currentTime = getCurrentTimeJSX();
  const [roomIsEmpty, setRoomIsEmpty] = useState(false);
  const [isSocketConnected, setSocketConnected] = useState(false);
  const [isPrivateRoom, setIsPrivateRoom] = useState(false);
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const typingTimeoutId = useRef(null);
  const currentTyper = useRef(null);
  const {
    addRoom,
    error,
    joinedListResponse,
    setJoinedListResponse,
    removeRoom,
    checkJoinedRoomList,
  } = useJoinedList();
  const [following, setFollowing] = useState(null);

  const navigate = useNavigate();
  const handleIsTyping = useIsTyping(
    socket,
    userLoginInfo.username,
    room,
    typingTimeoutId
  );

  const joinRoom = async () => {
    socket.emit("join_room", {
      room,
      username: userLoginInfo.username,
      message,
    });
    navigate(`/chatroom/${room}`);
    setLoading(true);
    const messages = await loadRoomHistory(room);
    setRoomData(messages.allRoomData);
    if (messages.allRoomData.private_room) {
      console.log(messages.allRoomData);
      try {
        const privateAccessExist = await axios.get(
          `${PORT}/api/users/${userLoginInfo.username}/rooms`
        );
        const response = privateAccessExist.data.roomsJoined;
        const listContainsRoom = response.find(
          (roomData) => parseInt(roomData.room) === parseInt(room)
        );
        if (listContainsRoom) {
          console.log('this is running')
          setIsPrivateRoom(false);
          setFollowing(true)
        } else {
          setIsPrivateRoom(true);
        }
      } catch (err) {
        console.log(err + `error in joinRoom mainRoom function`);
      }
    }
    if (messages.allRoomData.private_room === false) {
      try {
        const publicAccess = await axios.get(
          `${PORT}/api/users/${userLoginInfo.username}/rooms`
        );
        const roomsJoinedList = publicAccess.data.roomsJoined;
        const isInJoinedList = roomsJoinedList.find(
          (roomToFind) => parseInt(roomData.room) === parseInt(roomToFind)
        );
        if (isInJoinedList) {
          setFollowing(true);
        } else if (!isInJoinedList) {
          setFollowing(false);
        }
      } catch (err) {
        console.log(err + "mainRoom in JoinRoom() function for public access");
      }
    } 
    sessionStorage.setItem("lastRoom", room.toString());
    setInroom(room);
    setMessageRecieved(messages.messageHistory);
    setLoading(false);
    if (messages.messageHistory.length <= 0) {
      setRoomIsEmpty(true);
    }
  };

  const roomChanger = (event) => {
    setRoom(event.target.value);
  };
  const handleJoinRoomBtn = async () => {
    const addTheRoom = await addRoom(
      userLoginInfo.username,
      room,
      roomData.room_name
    );
    if (addTheRoom) {
      setJoinedListResponse(addTheRoom);
      if(addTheRoom === 'User Joined the room successfully.'){}
      console.log("running in addTheRoom");
      setFollowing(true);
      return console.log(joinedListResponse);
    }
    if (error) {
      console.error(error);
    }
  };
  const handleRemoveRoomBtn = async () => {
    const removeFromList = await removeRoom(
      userLoginInfo.username,
      room,
      roomData.room_name
    );
    if (removeFromList) {
      console.log("this is running right here");
      console.log(joinedListResponse);
      setJoinedListResponse(removeFromList);
      console.log("running in handeRemoveRoomBtn");
      setFollowing(false);
    }
    if (error) {
      console.error(error);
    }
  };
const checkList = async () => {
  try {
    const response = await axios.get(
      `${PORT}/api/users/${userLoginInfo.username}/rooms`
    );
    const publicAccess = response.data.roomsJoined;
    const listContainsRoom = publicAccess.find(
      (roomData) => parseInt(roomData.room) === parseInt(room)
    );

    if (listContainsRoom) {
      console.log("public list found room inside check list");
      setFollowing(true);
    } else {
      setFollowing(false);
    }
  } catch (error) {
    console.error("Error in checkList:", error);
    // Handle the error as needed
  }
};

  const sendMessageFunc = () => {
    setClicked(true);
    setTimeout(() => {
      setClicked(false);
    }, 800);
    if (message === "") {
      return;
    }
    const data = {
      message,
      room,
      timestamp: getCurrentTime(),
      username: userLoginInfo.username,
      sentBy: userLoginInfo.username,
      imageUrl: sessionImage ? sessionImage : userLoginInfo.imageUrl,
      cloudinary_id: sessionCloudinary_id
        ? sessionCloudinary_id
        : userLoginInfo.cloudinary_id,
    };
    socket.emit("send_message", data);
    setMessageRecieved((prev) => [...prev, data]);
    setMessage("");
  };

  const deleteRoom = () => {
    setMainAccess(true);
    socket.emit("deleteRoom", { room, username: userLoginInfo.username });
    socket.off("join_room", room);
    navigate("/currentServers");
  };

  const leaveRoom = () => {
    socket.emit("leaveroom", room);
    socket.disconnect();
    navigate("/currentservers");
  };
  useEffect(() => {
    // Handle socket connection

    if (!socket) {
      setSocket(
        io.connect(`${PORT}`, {
          reconnection: true,
          reconnectionAttempts: 20,
          reconnectionDelay: 2000,
        })
      );
      return setMainAccess(true);
    }
    checkList();
    const handleSocketConnect = async () => {
      const fetchRoomHistoryData = async () => {
        const data = await loadRoomHistory(room);
        setMessageRecieved(data.messageHistory);
        setSocketConnected(true);
      };

      if (socket.recovered) {
        console.log("Socket has recovered. Fetching room history...");
      } else {
        console.log("New or unrecoverable session.");
      }

      await fetchRoomHistoryData();
    };

    // Initialize socket if not already initialized

    // Auto join room if main access is true
    if (mainAccess === true) {
      joinRoom();

      setMainAccess(false);
    }

    // Socket event handlers
    socket.on("connect", handleSocketConnect);

    socket.on("disconnect", (reason) => {
      setSocketConnected(false);
      setMainAccess(true);
    });

    socket.on("receive_message", async (data) => {
      if (data.room !== room) return;
      setTyping(false);
      const newData = {
        message: data.message,
        username: data.sentBy,
        timestamp: getCurrentTime(),
        imageUrl: data.imageUrl,
        cloudinary_id: data.cloudinary_id,
      };

      setMessageRecieved((prev) => [...prev, newData]);
      await loadRoomHistory(data.room);
    });

    socket.on("sender_is_typing", (data) => {
      currentTyper.current = data.toString();
      clearTimeout(typingTimeoutId.current);
      setTyping(true);
      typingTimeoutId.current = setTimeout(() => {
        setTyping(false);
      }, 4000);
    });
    // Cleanup functions
    return () => {
      socket.off("join_room", joinRoom);
      socket.off("receive_message");
      socket.off("disconnect");
      socket.off("sender_is_typing", useIsTyping);
    };
    //eslint-disable-next-line
  }, [socket, messageRecieved, isSocketConnected, typing]);

  useEffect(() => {
    if (messagesStartRef.current) {
      messagesStartRef.current.scrollTop =
        messagesStartRef.current.scrollHeight;
    }
  }, [messageRecieved, typing]);
  useEffect(() => {
    if (joinedListResponse === "room was removed successfully") {
      console.log("running in useEffect as false");
      return setFollowing(false);
    } else if (joinedListResponse === "User joined the room successfully.") {
      console.log("running in useEffect as true");
      return setFollowing(true);
    }else if(joinedListResponse === ''){
      checkList();
    }
    if(joinedListResponse === 'User has already joined this room.'){
      setFollowing(true)
    }
  }, [following, joinedListResponse]);
  return (
    <>
      <Header
        roomChanger={roomChanger}
        room={room ? room : 1}
        joinRoom={joinRoom}
      />
      <div className="room-wrapper">
        <div className={"all-messages"} ref={messagesStartRef}>
          <div className="room_name">
            <h2>
              {lastRoom
                ? roomData.room_name
                : String.fromCodePoint(0x1f449) +
                  lastRoom +
                  " No Existing Room" +
                  String.fromCodePoint(0x1f448)}
            </h2>
          </div>
          {isPrivateRoom && (
            <PrivateRoomAccess
              roomData={roomData}
              setIsPrivateRoom={setIsPrivateRoom}
            />
          )}
          {messageRecieved.length > 0 &&
            !isPrivateRoom &&
            messageRecieved.map((msg, index) => {
              const timestampParts = msg.timestamp.split(" ");
              const datePart = timestampParts[0];
              const timePart = timestampParts[1] + " " + timestampParts[2];
              if (msg.sentBy === userLoginInfo.username) {
                // Message sent by current user
                let userLoggedIn = "@" + userLoginInfo.username.toUpperCase();
                //BLUE USER MESSAGE
                return (
                  <div key={index} className={"messagesContainer"}>
                    <div className={"container blue"}>
                      <div className={"message-timestamp-left"}>
                        {index !== 0 && (
                          <p>
                            {datePart}
                            <br />
                            {timePart}
                          </p>
                        )}
                      </div>
                      <div className={"message-blue"}>
                        <img
                          src={
                            userLoginInfo.imageUrl ||
                            userLoginInfo.cloudinary_id
                          }
                          loading="lazy"
                          className={"user-profile-pic blue"}
                          alt="Profile-Pic"
                          onClick={() =>
                            navigate(`/profile/${userLoginInfo.username}`)
                          }
                        />
                        <p className={"message-content"}>{msg.message}</p>
                      </div>
                      <p className={"user"}>{userLoggedIn}</p>
                    </div>
                  </div>
                );
              } else {
                // GREEN USER MESSAGE
                return (
                  <div key={index} className={"messagesContainer"}>
                    <div className={"container green"}>
                      <div className={"message-timestamp-right"}>
                        <p>
                          {datePart}
                          <br />
                          {index !== 0 && timePart}
                        </p>
                      </div>
                      <div className={"message-green"}>
                        <img
                          src={msg.imageUrl || msg.cloudinary_id}
                          loading="lazy"
                          className={"user-profile-pic green"}
                          alt="Profile-Pic"
                          onClick={() => navigate(`/profile/${msg.sentBy}`)}
                        />
                        <p className={"message-content"}>{msg.message}</p>
                        <p className={"user green"}>
                          {msg.sentBy
                            ? "@" + msg.sentBy.toUpperCase()
                            : "@" + msg.username.toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              }
            })}
          {roomIsEmpty && navigate(`/createroom/${room}`)}
          {typing === true && <TypingComp typer={currentTyper.current} />}
        </div>
        {!isPrivateRoom && (
          <>
            <div className="send-input-wrapper">
              <input
                placeholder={"Message..."}
                id={"send_message_input"}
                value={message}
                onChange={(event) => {
                  setMessage(event.target.value);
                  handleIsTyping(event);
                }}
                maxLength="255"
              />
              <button
                className={`sendMsgBtn ${clicked ? "open" : ""}`}
                onClick={sendMessageFunc}>
                Send
                <img
                  src={sendIcon}
                  className={` ${clicked ? "clicked" : ""}`}
                  alt={"icon-for-send"}></img>
              </button>
            </div>
            <div className={"helper_tools_wrapper"}>
              <button id={"leave-room-btn"} onClick={leaveRoom}>
                <ReplyRoundedIcon />
                Back
              </button>
              {!following && (
                <button
                  className={"subscribe_to_room"}
                  onClick={() => handleJoinRoomBtn()}>
                  <AddBoxOutlinedIcon id={"subscribe_btn"} />
                  Subscribe
                </button>
              )}
              {following && (
                <button
                  className={"subscribe_to_room _joined"}
                  onClick={() => handleRemoveRoomBtn()}>
                  <IndeterminateCheckBoxOutlinedIcon id={"unsubscribe_icon"} />
                  Unsubscribe
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {
        <>
          <div className={"status_container"}>
            <h3 style={{ color: "white" }}>Status :</h3>
            <button
              type="button"
              className={"statusBtn"}
              onClick={() => {
                joinRoom();
              }}
              style={
                isSocketConnected
                  ? { backgroundColor: "#323232" }
                  : { backgroundColor: "red", color: "#3691F0" }
              }>
              {isSocketConnected && "Connected"}
              {!isSocketConnected && "DISCONNECTED"}
            </button>
          </div>
        </>
      }
      <div className="leave-delete-button">
        <button onClick={deleteRoom}>Delete Room</button>
      </div>
    </>
  );
};
export default MainRoom;
