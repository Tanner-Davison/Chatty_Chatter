import { useState, useEffect } from "react";
import './MainRoom.css'




const MainRoom = ({ setMainAccess, mainAccess, userInfo, socket }) => {


  const [message, setMessage] = useState("");
  const [messageRecieved, setMessageRecieved] = useState([]);
  const [room, setRoom] = useState(1);

  const joinRoom = () => {
    socket.emit("join_room", {
      room: room,
      username: userInfo.username,
      message: message,
    });
  loadRoomHistory();
  };
const loadRoomHistory = async () => {
  const response = await fetch(`http://localhost:3001/roomHistory/${room}`);
  const data = await response.json();

  // assuming the server returns an array of messages
  if (data.messageHistory) {
    setMessageRecieved(data.messageHistory);
    console.log(messageRecieved)
  }
};
  const sendUserInfo = (userInfo) => {
    socket.emit("user_info", userInfo);
  };
  const leaveMain = () => {
    setMainAccess(false);
    socket.emit("leave", room);
  };
  const sendMessageFunc = () => {
    // Emit the message
    const newMessage = {
      message: message,
      room,
      timestamp: getCurrentTime(),
      username: userInfo.username, // add this line
    };

    socket.emit("send_message", newMessage);

    // Update local state to include the new message
    setMessageRecieved((prev) => [...prev, newMessage]);
    setMessage("");
   
  };
  const getCurrentTime = () => {
    const date = new Date();
    let year = String(date.getFullYear())
    const month = String(date.getMonth() +1)
    let hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    
    const strTime = `${month}/${year} @${hours}:${minutes} ${ampm}`;
    return strTime;
  };
 
  useEffect(() => {
    if (!socket) return; // Prevent code from running if socket is null or undefined

    if (mainAccess === true) {
      joinRoom();
      setMainAccess("undefined");
      sendUserInfo(userInfo);
    }
    
    const handleReceiveMessage = (data) => {
      setMessageRecieved((prev) => [
        ...prev,
        {
          message: data.message,
          username: data.username,
          timestamp: getCurrentTime(),
        },
      ]);
    };
    setMessage("");
    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
    // eslint-disable-next-line
  }, [socket, messageRecieved]);

  return (
    <div className="App">
      <div className="header">
        <div className={"room-num-input"}>
          <input
            placeholder="Room #"
            value={room}
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
          <button type="submit" onClick={joinRoom}>
            Join Room
          </button>
        </div>
        <div className={"room-num-input"}>
          <input
            placeholder={message !== "" ? message: "Message..."}
            onChange={(event) => {
              setMessage(event.target.value);
            }}
          />
          <button onClick={sendMessageFunc}>Send Message</button>
        </div>
        <h1>Converstion: </h1>
        <div>
          {messageRecieved.map((msg, index) => {
            console.log(msg.message)
            if (msg.username === userInfo.username) {
              // Message sent by current user
              return (
                <>
                  <div key={index} className={"messageBlockWrapper"}>
                    <div  className={"messagesContainer sender"}>
                      <h3>{msg.message}</h3>
                    </div>
                    <p className={"username sender"}>{msg.username} </p>
                    <p>{msg.timestamp}</p>
                  </div>
                </>
              );
            } else {
              // Message received from another user
              return (
								<>
                  <div
                    draggable="true"
                   
										key={index}
                    className={"messageBlockWrapper"}>
                    
										<div className={"messagesContainer receiver"}>
											<h3 className={"message_body"}>{msg.message}</h3>
										</div>
										<div className={"timestamp_hidden"}>
											<p className={"timestamp"}>{msg.timestamp}</p>
										</div>

										<div className={"username receiver"}>
											<p style={{ color: "white" }}>{msg.sentBy}</p>
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
