import React, { useState, useEffect, useContext, useRef } from "react";
import { LoginContext } from "./contexts/LoginContext";
import "./MainRoom.css";
import "../App.css";
import { loadRoomHistory } from "./Utility-mainRoom/loadRoomHistory";
import getCurrentTime, { getCurrentTimeJSX } from "./Utility-mainRoom/getTime";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import Header from "./Header/Header";
import CreateRoom from './Utility-mainRoom/CreateRoom'

const MainRoom = () => {
  const {
    userLoginInfo,
    mainAccess,
    setMainAccess,
    socket,
    setSocket,
  } = useContext(LoginContext);

  const [message, setMessage] = useState("");
  const [messageRecieved, setMessageRecieved] = useState([]);
  const lastRoom = sessionStorage.getItem("lastRoom");
  const initialRoom = lastRoom ? parseInt(lastRoom, 10) : 1;
  const [room, setRoom] = useState(initialRoom);
  const [inRoom, setInroom] = useState(initialRoom );
  const sessionImage = sessionStorage.getItem("image-url");
  const sessionCloudinary_id = sessionStorage.getItem("cloudinary_id");
  const messagesStartRef = useRef(null);
  const PORT = process.env.PORT;
  const currentTime = getCurrentTimeJSX();
  const [roomIsEmpty, setRoomIsEmpty] = useState(false)
  const [isSocketConnected, setSocketConnected] = useState(false);
  const navigate = useNavigate();
  
  const joinRoom = async () => {
    socket.emit("join_room", {
      room,
      username: userLoginInfo.username,
      message,
    });
    navigate(`/chatroom/${room}`);
    const messages = await loadRoomHistory(room);
    sessionStorage.setItem("lastRoom", room.toString());
    setInroom(room);
    setMessageRecieved(messages);
    if(messages.length <= 0){
      setRoomIsEmpty(true);
    }
  };

  const roomChanger = (event) => {
    setRoom(event.target.value);
  };

  const sendMessageFunc = () => {
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
    const handleSocketConnect = async () => {
      const fetchRoomHistoryData = async () => {
        const messages = await loadRoomHistory(room);
        setMessageRecieved(messages);
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
    if (!socket) {
      setSocket(
        io.connect(`${PORT}`, {
          reconnection: true,
          reconnectionAttempts: 20,
          reconnectionDelay: 2000,
        })
      );

      return;
    }

    // Auto join room if main access is true
    if (mainAccess === true) {
      joinRoom();
      setMainAccess(false);
    }

    // Socket event handlers
    socket.on("connect", handleSocketConnect);

    socket.on("disconnect", (reason) => {
      console.log(reason);
      setSocketConnected(false);
      setMainAccess(true);
    });

    socket.on("receive_message", async (data) => {
      if (data.room !== room) return;

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

    // Cleanup function to remove event listeners
    return () => {
      socket.off("join_room", joinRoom);
      socket.off("receive_message");
      socket.off("disconnect");
    };

    //eslint-disable-next-line
  }, [socket, messageRecieved, isSocketConnected]);

  useEffect(() => {
    if (messagesStartRef.current) {
      messagesStartRef.current.scrollTop =
        messagesStartRef.current.scrollHeight;
    }
  }, [messageRecieved]);

 
 
  return (
    <>
      <Header
        roomChanger={roomChanger}
        room={room ? room : 1}
        joinRoom={joinRoom}
      />
      <div className="roomWrapper">
        <div className={"all-messages"} ref={messagesStartRef}>
          <div className="room_name">
            <h2>
              {lastRoom
                ? "Room:" + lastRoom
                : String.fromCodePoint(0x1f449) +
                  lastRoom + " No Existing Room" +
                  String.fromCodePoint(0x1f448)}
            </h2>
          </div>

          {messageRecieved.length > 0 &&
            messageRecieved.map((msg, index) => {
              const timestampParts = msg.timestamp.split(" ");
              const datePart = timestampParts[0];
              const timePart = timestampParts[1] + " " + timestampParts[2];

              if (msg.sentBy === userLoginInfo.username) {
                // Message sent by current user
                let userLoggedIn = "@" + userLoginInfo.username.toUpperCase();
                return (
									<div
										key={index}
										className={"messagesContainer"}>
										<div className={"container blue"}>
											<div className={"message-timestamp-left"}>
												<p>{currentTime}</p>
											</div>
											<div className={"message-blue"}>
												<img
													src={
														userLoginInfo.imageUrl ||
														userLoginInfo.cloudinary_id
													}
													loading='lazy'
													className={"user-profile-pic blue"}
													alt='Profile-Pic'
													onClick={() => navigate(`/profile/${userLoginInfo.username}`)}
												/>
												<p className={"message-content"}>{msg.message}</p>
											</div>
											<p className={"user"}>{userLoggedIn}</p>
										</div>
									</div>
								);
              } else {
                // Message received from another user
                return (
                  <div key={index} className={"messagesContainer"}>
                    <div className={"container green"}>
                      <div className={"message-timestamp-right"}>
                        <p>
                          {datePart}
                          <br />
                          {timePart}
                        </p>
                      </div>
                      <div className={"message-green"}>
                        <img
                          src={msg.imageUrl || msg.cloudinary_id}
                          loading="lazy"
                          className={"user-profile-pic green"}
                          alt="Profile-Pic"
                          onClick={()=> navigate(`/profile/${msg.sentBy}`)}
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
        </div>
      </div>
      <div className={"room-num-input-mainRoom"}>
        <input
          placeholder={message !== "" ? message : "Message..."}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          maxLength="255"
        />
        <button className={"sendMsgBtn"} onClick={sendMessageFunc}>
          Send
        </button>
      </div>
      <div className="leave-delete-button">
        <button onClick={leaveRoom}>Leave Room</button>
        <button onClick={deleteRoom}>Delete Room</button>
      </div>

      {
        <>
          <div className={"status_container"}>
            <h3 style={{ color: "white" }}>Status:</h3>
            <button
              type="button"
              className={"statusBtn"}
              onClick={() => {
                joinRoom();
              }}
              style={
                isSocketConnected
                  ? { backgroundColor: "limegreen" }
                  : { backgroundColor: "red", color: "white" }
              }>
              {isSocketConnected && "CONNECTED"}
              {!isSocketConnected && "DISCONNECTED"}
            </button>
          </div>
        </>
      }
    </>
  );
};
export default MainRoom;
