import { useState, useEffect } from "react";
import io from "socket.io-client";

const MainRoom = ({  setMainAccess }) => {
    
	const [message, setMessage] = useState("");
	const [messageRecieved, setMessageRecieved] = useState([]);
	const [room, setRoom] = useState(1);
    const [socket, setSocket] = useState(false);
	
    useEffect(() => {
        joinRoom();
        
		});
    const joinRoom = () => {
        if (!socket) {
            setSocket(io.connect("http://localhost:3001"));
           
        } else {
            socket.emit("join_room", room);
        }
    };
    const leaveMain = () => {
        setMainAccess(false)
        socket.emit('leave', room)
    }
    const sendMessageFunc = (event) => {
       event.preventDefault()
		socket.emit("send_mesage", { message: message, room });
	};
    
    useEffect(() => {
        if (!socket) {
            return;
        }
        socket.on("receive_message", (data) => {
			setMessageRecieved((prev)=> [...prev, data.message]);
			console.log(messageRecieved);
		});
	}, [socket]);

	return (
		<div className='App'>
			<div className='header'>
				<div className={"room-num-input"}>
					<input
						placeholder='Room #'
						value={room}
						onChange={(event) => {
							setRoom(event.target.value);
						}}
					/>
					<button onClick={joinRoom}>Join Room</button>
				</div>
				<div className={"room-num-input"}>
					<input
						placeholder='Message...'
						onChange={(event) => {
							setMessage(event.target.value);
						}}
					/>
					<button onClick={sendMessageFunc}>Send Message</button>
				</div>
				<h1>Converstion: </h1>
                <h1>{messageRecieved.map((messages,index) => {
                    return (<p key={index}>{messages}</p>)
                })}</h1>
            </div>
            <button onClick={leaveMain}>Leave Room</button>
		</div>
	);
};
export default MainRoom;
