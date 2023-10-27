import {useState} from 'react';
import './CreateRoom.css'
import toggleOff from './svgs/toggleOff.svg';
import toggleOn from './svgs/toggleOn.svg';
import Header from '../Header/Header';
import build from './svgs/build.svg'
import lockOpen from './svgs/lockOpen.svg';
import locked from './svgs/locked.svg';
import { useParams } from "react-router-dom";

const CreateRoom = (props)=>{
  const username = props.username;
  const {room} = useParams();
	const [roomName, setRoomName] = useState('')
  const [roomPassword,setRoomPassword] = useState('')
  const [privateRoom, setPrivateRoom] = useState(true)
    

  return (
		<>
			<Header />

			<form className={"form-wrapper"}>
				<div className={"wrapper"}>
					<div id={"header-border"}>
						<h2>Room</h2>
						<img
							src={build}
							alt={"icon"}
							height={40}
						/>
						<h2>Builder</h2>
					</div>
					<div className={"question-wrapper"}>
						<div className={"toggle-wrapper"}>
							<p
								style={{ borderColor: "white" }}
								className={privateRoom ? "public-off true" : "public-off"}>
								Public
							</p>
							<img
								src={lockOpen}
								alt={"lock open icon"}
								style={!privateRoom ? { opacity: "100" } : { opacity: "0" }}
							/>
							<img
								src={privateRoom ? toggleOff : toggleOn}
								alt={"toggleOff"}
								height={60}
								className={"toggleSvg"}
								onClick={() => setPrivateRoom(!privateRoom)}
							/>
							<span>
								<img
									src={locked}
									alt={"lock open icon"}
									className={"material-icon"}
									style={
										privateRoom
											? { opacity: "100", fill: "black" }
											: { opacity: "0" }
									}
								/>
							</span>
							<p
								style={{ borderColor: "lightgreen" }}
								className={privateRoom ? "public-off" : "public-off true"}>
								Private
							</p>
						</div>
						{privateRoom && (
							<>
								<div className={"private-wrapper"}>
									<div className={"private-room-inputs"}>
										<label htmlFor={"name"}> Room Name:</label>
										<input
											type='text'
											id='name'
											style={{ width: "150px" }}
											onChange={(e) => setRoomName(e.target.value)}
											value={roomName}
										/>
									</div>
									<div className={"private-room-inputs"}>
										<label htmlFor={"room-password"}> room password:</label>
										<input
											type='text'
											id='room-password'
											style={{ width: "150px" }}
											onChange={(e) => setRoomPassword(e.target.value)}
											value={roomName}
										/>
									</div>
								</div>
							</>
						)}
						{!privateRoom && (
							<>
								<div>
									<content>
										<h4>
											Room {room} is <span style={{color:'lightgreen'}}>available</span> to create a new
											public room!
										</h4>
                  </content>
                  <input type='text'
                    value={category} />
								</div>
							</>
						)}
					</div>
				</div>
			</form>
		</>
	);
}
export default CreateRoom