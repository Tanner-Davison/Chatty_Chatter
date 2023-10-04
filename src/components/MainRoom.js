import { useState, useEffect, useContext } from "react";
import { LoginContext } from "./contexts/LoginContext";
import "./MainRoom.css";
import "../App.css";
import { loadRoomHistory } from "./Utility-mainRoom/loadRoomHistory";
import getCurrentTime from "./Utility-mainRoom/getTime";
import io from 'socket.io-client';

const MainRoom = () => {
  const {
    userLoginInfo,
    setUserLoginInfo,
    mainAccess,
    setMainAccess,
    socket,
    setSocket
    
  } = useContext(LoginContext);
  
  const [message, setMessage] = useState("");
  const [messageRecieved, setMessageRecieved] = useState([]);
  const [room, setRoom] = useState(1);
  const useTempName = JSON.parse(localStorage.getItem('username'))
  const [roomChange,setRoomChange] = useState('')

  const joinRoom = async () => {
    console.log(room);
    socket.emit("join_room", {
      room: room,
      username: userLoginInfo.username,
      message: message,
    });
    setRoomChange(room)
    const messages = await loadRoomHistory(room);

    setMessageRecieved(messages);
  };

  const sendUserInfo = (userLoginInfo) => {
    socket.emit("user_info", userLoginInfo);
  };
  const leaveMain = () => {
    setMainAccess(false);
    socket.emit("leave", room);
    socket.off("join_room", room);
    console.log('working')
  };
  const sendMessageFunc = () => {
    // Emit the message
    const newMessage = {
      message: message,
      room,
      timestamp: getCurrentTime(),
      username: userLoginInfo.username, // add this line
      sentBy: userLoginInfo.username,
    };

    socket.emit("send_message", newMessage);

    // Update local state to include the new message
    setMessageRecieved((prev) => [...prev, newMessage]);
  };
 
  useEffect(() => {
    if (!socket){
      console.log('there is no active socket')
      setSocket(io.connect("http://localhost:3001"));
     setUserLoginInfo({
       username: JSON.parse(localStorage.getItem('username')),
       password: JSON.parse(localStorage.getItem('password')),
     });
     
      return 
    } // Prevent code from running if socket is null or undefined

    if (mainAccess === true) {
      sendUserInfo(userLoginInfo);
      joinRoom();
      setMainAccess(false);
      console.log("use effect ran");
    }
   

    socket.on("error", (error) => {
      console.error("Socket Error:", error);
    });

    const handleReceiveMessage = (data) => {
      setMessageRecieved((prev) => [
        {
          message: data.message,
          username: data.username,
          timestamp: getCurrentTime(),
        },
        ...prev,
      ]);
    };
    setMessage("");
    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("error");
      socket.off("receive_message", handleReceiveMessage);
      socket.off("join_room", joinRoom);
   
    };
    // eslint-disable-next-line
  }, [socket, messageRecieved]);
 useEffect(() => {
  if(userLoginInfo.username !== ""){
joinRoom();
  }
   
 }, [userLoginInfo]);
  return (
		<div className='App'>
			<div className='header'>
				<div>
					<h2 style={{color:'white'}}>{userLoginInfo.username} </h2>
				</div>
				<div className={"room-num-input"}>
					<input
						placeholder='Room #'
						value={room}
						onChange={(event) => {
							setRoom(event.target.value);
						}}
					/>
					<button
						type='submit'
						onClick={joinRoom}>
						Join Room
					</button>
				</div>
				<div className={"room-num-input"}>
					<input
						placeholder={message !== "" ? message : "Message..."}
						onChange={(event) => {
							setMessage(event.target.value);
						}}
					/>
					<button onClick={sendMessageFunc}>Send Message</button>
				</div>
				<h1>Welcome to room #{roomChange} </h1>
				<div className={'all-messages'}>
					{messageRecieved.map((msg, index) => {
						console.log(msg.sentBy, useTempName);
						if (msg.sentBy === userLoginInfo.username) {
            console.log(msg.timestamp)
							// Message sent by current user
							return (
								<>
									<div
										key={index}
										className={"messagesContainer"}>
										<div className={"container blue"}>
											<div className={"message-blue"}>
												<p className={"message-content"}>{msg.message}</p>
											</div>
											<p className={"user"}>{userLoginInfo.username}</p>
											<div className={"message-timestamp-left"}>
												<p>Sent:{msg.timestamp}</p>
										</div>
											</div>
									</div>
								</>
							);
						} else {
							// Message received from another user
							return (
								<>
									<div
										key={index}
										className={"messagesContainer"}>
										<div className={"container green"}>
											<div className={"message-green"}>
												<p className={"message-content"}>{msg.message}</p>
											</div>
											<p className={"user"}>
												{msg.sentBy ? msg.sentBy : useTempName}
											</p>
											<div className={"message-timestamp-right"}>
												<p>Delivered: {msg.timestamp}</p>
											</div>
										</div>
									</div>
								</>
							);
						}
					})}
				</div>
			</div>
			<button onClick={leaveMain}>Leave Room</button>
		</div>
	);
};
export default MainRoom;
