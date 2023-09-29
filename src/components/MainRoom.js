import { useState, useEffect } from "react";
import './MainRoom.css'
import '../App.css'
import { loadRoomHistory } from "./Utility-mainRoom/loadRoomHistory";
import getCurrentTime from "./Utility-mainRoom/getTime";

const MainRoom = ({ setMainAccess, mainAccess, userInfo, socket }) => {
  const [message, setMessage] = useState("");
  const [messageRecieved, setMessageRecieved] = useState([]);
  const [room, setRoom] = useState(1);

  const joinRoom = async () => {
    socket.emit("join_room", {
      room: room,
      username: userInfo.username,
      message: message,
    });

    const messages = await loadRoomHistory(room);
    setMessageRecieved(messages);
  };

  const sendUserInfo = (userInfo) => {
    socket.emit("user_info", userInfo);
  };
  const leaveMain = () => {
    setMainAccess(false);
    socket.emit("leave", room);
    socket.off("join_room",room)
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
 
 
  useEffect(() => {
    if (!socket) return; // Prevent code from running if socket is null or undefined
    const init = async () => {
      if (mainAccess === true) {
				joinRoom();
				setMainAccess("undefined");
				sendUserInfo(userInfo);
			}
    }
    init();
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
        <h1>Welcome to room #{room} </h1>
        <div>
          {messageRecieved.map((msg, index) => {
            console.log(msg.username)
            if (msg.username === userInfo.username) {
              // Message sent by current user
              return (
								<>
									<div className={"messagesContainer"}>
										<div
											key={index}
											className={"container"}>
											<div className={"message-blue"}>
												<p className={"message-content"}>{msg.message}</p>
											</div>
											<p className={"user"}>{msg.username}</p>
											<div className={"message-timestamp-left"}>
												<p>Sent: {msg.timestamp}</p>
											</div>
										</div>
									</div>
								</>
							);
            } else  {
              // Message received from another user
              return (
                <>
                  <div className={"messagesContainer"}>
                    <div key={index} className={"container"}>
                      <div className={"message-green"}>
                        <p className={"message-content"}>{msg.message}</p>
                      </div>
                      <p className={"user"}>{msg.sentBy ? msg.sentBy:msg.username }</p>
                      <div className={"message-timestamp-right"}>
                        <p>Sent: {msg.timestamp}</p>
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
