import { useState, useEffect } from "react";

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
	};

	const sendUserInfo = (userInfo) => {
		socket.emit("user_info", userInfo);
	};
	const leaveMain = () => {
		setMainAccess(false);
		socket.emit("leave", room);
	};
	const sendMessageFunc = () => {
		socket.emit("send_message", {
			message: message,
			room,
			timestamp: new Date().toISOString(),
		});
	};

	useEffect(() => {
		if (!socket) return; // Prevent code from running if socket is null or undefined

		if (mainAccess === true) {
			joinRoom();
			setMainAccess("undefined");
			sendUserInfo(userInfo);
		}

		const handleReceiveMessage = (data) => {
			setMessageRecieved((prev) => [...prev, data.message]);
			console.log(messageRecieved);
		};

		socket.on("receive_message", handleReceiveMessage);

		// Cleanup listener when component is unmounted or dependencies change
		return () => {
			socket.off("receive_message", handleReceiveMessage);
		};
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
					<button
						type='submit'
						onClick={joinRoom}>
						Join Room
					</button>
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
				<div>
					{messageRecieved.map((messages, index) => {
						return <p key={index}>{messages}</p>;
					})}
				</div>
			</div>
			<button onClick={leaveMain}>Leave Room</button>
		</div>
	);
};
export default MainRoom;
