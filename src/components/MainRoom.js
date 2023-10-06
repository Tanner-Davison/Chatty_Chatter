import { useState, useEffect, useContext } from "react";
import { LoginContext } from "./contexts/LoginContext";
import "./MainRoom.css";
import "../App.css";
import { loadRoomHistory } from "./Utility-mainRoom/loadRoomHistory";
import getCurrentTime from "./Utility-mainRoom/getTime";
import io from 'socket.io-client';
import { getCurrentTimeJSX } from "./Utility-mainRoom/getTime";
import { useNavigate } from "react-router-dom";


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
 
  const [currentTime, setCurrentTime] = useState(getCurrentTimeJSX())
  const [isSocketConnected, setSocketConnected] = useState(false)
  const navigate = useNavigate();

  const joinRoom = async () => {
    socket.emit("join_room", {
      room: room,
      username: userLoginInfo.username,
      message: message,
    });
    const messages = await loadRoomHistory(room);
    setMessageRecieved(messages);
  };
  const roomChanger = (event) => {
  // setMessageRecieved("")
	setRoom(event.target.value);
};
  const sendUserInfo = (userLoginInfo) => {
    socket.emit("user_info", userLoginInfo);
  };
  const deleteRoom = () => {
    setMainAccess(true);
    socket.emit("deleteRoom",{room: room, username:userLoginInfo.username});
    socket.off("join_room", room);
   navigate('/currentServers')
  };
  const leaveRoom = () => {
    socket.emit("leaveroom", room)
    socket.disconnect();
    navigate('/currentservers')
  }
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
   
    setMessageRecieved((prev) => [...prev, newMessage]);
    loadRoomHistory(room);
    
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
    }
    socket.on("connection", () => {
      setSocketConnected(socket.connected)
    })
    socket.on("disconnect", () => setSocketConnected(socket.connected));
    
    socket.on("error", (error) => {
      console.error("Socket Error:", error);
    });
    
    socket.on("receive_message", async (data) => {
      setMessageRecieved((prev) => [
				...prev,
				{
					message: data.message,
					username: data.username,
					timestamp: getCurrentTime(),
				},
      ]);
      const messages = await loadRoomHistory(room);
      setMessageRecieved(messages);
    
    });

    return () => {
      socket.off("error");
      socket.off("join_room", joinRoom);
      
    };
    // eslint-disable-next-line
  }, [socket, messageRecieved, isSocketConnected]);
  useEffect(() => {
    if (!userLoginInfo) {
      loadRoomHistory(room)
    }
  });
 
  return (
    <div className="App">
      <div className="header">
        <div className={"headerContainer"}>
          <h2 style={{ color: "white" }}>{userLoginInfo.username} </h2>

          <div className={"room-num-input"}>
            <h2 style={{color:'white'}}>create Your own server!</h2>
            <input
              placeholder="Room #"
              value={room}
              onChange={roomChanger}
            />
            <button type="submit" onClick={joinRoom}>
              Join Room
            </button>
          </div>
        </div>
        <h1>Welcome to room #{room} </h1>
        <div className={"room-num-input"}>
          <input
            placeholder={message !== "" ? message : "Message..."}
            onChange={event => setMessage(event.target.value)}
          />
          <button onClick={sendMessageFunc}>Send Message</button>
        </div>
        <div className={"all-messages"}>

          {messageRecieved.map((msg, index) => {
            if (msg.sentBy === userLoginInfo.username) {
              
              // Message sent by current user
              return (
                
                  <div key={index} className={"messagesContainer"}>
                    <div className={"container blue"}>
                      <div className={"message-blue"}>
                        <p className={"message-content"}>{msg.message}</p>
                      </div>
                      <p className={"user"}>{userLoginInfo.username}</p>
                      <div className={"message-timestamp-left"}>
                        <p>Sent:{currentTime}</p>
                      </div>
                    </div>
                  </div>
               
              );
            } else {
              // Message received from another user
              return (
                
                  <div key={index} className={"messagesContainer"}>
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
              );
            }
          })}
        </div>
      </div>
      <button onClick={leaveRoom} >
        Leave Room
      </button>
      <button
      onClick={deleteRoom}> Delete Room </button>
    <div>{isSocketConnected ? (<h1>Connected</h1>): (<h1>No Connection</h1>)}</div>
    </div>
  );
};
export default MainRoom;
