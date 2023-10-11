import { useState, useEffect, useContext, useRef } from "react";
import { LoginContext } from "./contexts/LoginContext";
import "./MainRoom.css";
import "../App.css";
import { loadRoomHistory } from "./Utility-mainRoom/loadRoomHistory";
import getCurrentTime from "./Utility-mainRoom/getTime";
import io from "socket.io-client";
import { getCurrentTimeJSX } from "./Utility-mainRoom/getTime";
import { useNavigate } from "react-router-dom";
import Header from "./Header/Header";
const MainRoom = () => {
  const {
    userLoginInfo,
    setUserLoginInfo,
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
  const sessionUsername = JSON.parse(sessionStorage.getItem("username"));
  const sessionPassword = JSON.parse(sessionStorage.getItem("password"));
  const [userProfileImg,setUserProfileImg]=useState('')
  const messagesStartRef = useRef("");
  const PORT = process.env.PORT;

  const currentTime = getCurrentTimeJSX();
  const [isSocketConnected, setSocketConnected] = useState("");
  const [latestRoom, setlatestRoom] = useState(1);

  const navigate = useNavigate();

  const joinRoom = async() => {
    console.log({ joinRoom: userLoginInfo.username });
    socket.emit("join_room", {
      room: room,
      username: userLoginInfo.username,
      message: message,
    });
    const messages = await loadRoomHistory(room);
    sessionStorage.setItem("lastRoom", room.toString());
    setlatestRoom(room);
    setMessageRecieved(messages);
  };
 const userInfo = async () => {
   const response = await fetch(`/user_info/${sessionUsername}`);
   const data = await response.json();
   setUserProfileImg(data.profileImage.url);
   if(!data.profileImage.url){
    console.log('no Image url found')
   }
 };
  const roomChanger = (event) => {
    setRoom(event.target.value);
  };

  const deleteRoom = () => {
    setMainAccess(true);
    socket.emit("deleteRoom", { room: room, username: userLoginInfo.username });
    socket.off("join_room", room);
    navigate("/currentServers");
  };
  const leaveRoom = () => {
    socket.emit("leaveroom", room);
    socket.disconnect();
    navigate("/currentservers");
  };
  const sendMessageFunc = () => {
    const newMessage = {
      message: message,
      room,
      timestamp: getCurrentTime(),
      username: userLoginInfo.username, 
      sentBy: userLoginInfo.username,
    };

    socket.emit("send_message", newMessage);
    setMessageRecieved((prev) => [...prev, newMessage]);
    loadRoomHistory(room);
  };

  useEffect(() => {
    console.log(isSocketConnected);
    if (!socket) {
      setSocket(io.connect(PORT));
      setUserLoginInfo({
        username: JSON.parse(sessionStorage.getItem("username")),
        password: JSON.parse(sessionStorage.getItem("password")),
      });
      userInfo();
      return;
    } // Prevent code from running if socket is null or undefined
    if (isSocketConnected === "Disconnected") {
      setUserLoginInfo({
        username: sessionUsername,
        password: sessionPassword,
      });
      console.log("working");
      setSocketConnected("Connected");
      return;
    }
    console.log(mainAccess);
    if (mainAccess === true) {
      joinRoom();
      setMainAccess(false);
    }

    console.log(messageRecieved);
    socket.on("connect", () => {
      setSocketConnected("Connected");
    });

    socket.on("disconnect", (reason) => {
      setSocketConnected("Disconnected");
      setMainAccess(true)
    });

    socket.on("error", (error) => {
      console.error("Socket Error:", error);
    });

    const handleReceiveMessage = async (data) => {
      if (data.room !== room) {
        return;
      }
      setMessageRecieved((prev) => [
        ...prev,
        {
          message: data.message,
          username: data.sentBy,
          timestamp: getCurrentTime(),
        },
      ]);
      console.log(data.sentBy);
      await loadRoomHistory(data.room);
    };
    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("error");
      socket.off("join_room", joinRoom);
      socket.off("receive_message", handleReceiveMessage);
    };
    // eslint-disable-next-line
  }, [socket, messageRecieved, isSocketConnected]);
  useEffect(() => {
    if (!userLoginInfo) {
      loadRoomHistory(room);
    }
  });
  useEffect(() => {
    if (messagesStartRef.current) {
      messagesStartRef.current.scrollTop =
        messagesStartRef.current.scrollHeight;
    }
  }, [messageRecieved]);

  return (
		<>
			<div className='App'>
				<div className='header'>
					<Header
						roomChanger={roomChanger}
						room={room}
						joinRoom={joinRoom}
					/>
					<div
						className={"all-messages"}
						ref={messagesStartRef}>
						<div className="room_name">
							<h2> {room}</h2>
						</div>
						{messageRecieved.length > 0 &&
							messageRecieved.map((msg, index) => {
								if (msg.sentBy === userLoginInfo.username) {
									// Message sent by current user
									return (
										<div
											key={index}
											className={"messagesContainer"}>
											<div className={"container blue"}>
												<div className={"message-blue"}>
													<p className={"message-content"}>{msg.message}</p>
												</div>
												<p className={"user"}>{userLoginInfo.username}</p>
												<div className={"message-timestamp-left"}>
													<p>{currentTime}</p>
												</div>
											</div>
										</div>
									);
								} else {
									// Message received from another user
									return (
										<div
											key={index}
											className={"messagesContainer"}>
											<div className={"container green"}>
												<div className={"message-green"}>
													<p className={"message-content"}>{msg.message}</p>
												</div>
												<p className={"user"}>
													{msg.sentBy ? msg.sentBy : msg.username}
												</p>
												<div className={"message-timestamp-right"}>
													<p>{msg.timestamp}</p>
												</div>
											</div>
										</div>
									);
								}
							})}
						{messageRecieved.length <= 0 && (
							<>
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
									}}>
									<h1>No Room History</h1>
									<p>please choose another room or rejoin</p>
								</div>
							</>
						)}
					</div>
				</div>
				<div className={"room-num-input-mainRoom"}>
					<input
						placeholder={message !== "" ? message : "Message..."}
						value={message}
						onChange={(event) => setMessage(event.target.value)}
						maxLength='255'
					/>
					<button onClick={sendMessageFunc}>Send Message</button>
				</div>
				<button onClick={leaveRoom}>Leave Room</button>
				<button onClick={deleteRoom}> Delete Room </button>

				{
					<>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								gap: "8px",
							}}>
							<h3 style={{ color: "white" }}>Status:</h3>
							<button
								type='button'
								id={"statusBtn"}
								style={
									isSocketConnected === "Connected"
										? { backgroundColor: "rgba(46, 178, 13, 0.5)" }
										: { backgroundColor: "red" }
								}>
								{isSocketConnected.toUpperCase()}
							</button>
						</div>
					</>
				}
			</div>
		</>
	);
};
export default MainRoom;
