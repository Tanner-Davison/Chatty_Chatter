import {LoginContext} from '../contexts/LoginContext';
import toggleOff from "./svgs/toggleOff.svg";
import { useParams } from "react-router-dom";
import { useState,useContext, useEffect } from "react";
import toggleOn from "./svgs/toggleOn.svg";
import lockOpen from "./svgs/lockOpen.svg";
import locked from "./svgs/locked.svg";
import Header from "../Header/Header";
import build from "./svgs/build.svg";
import "./CreateRoom.css";

const CreateRoom = (props) => {
	const {
		userLoginInfo,
	} = useContext(LoginContext);
	const [roomPassword, setRoomPassword] = useState("");
	const [privateRoom, setPrivateRoom] = useState(true);
	const [roomName, setRoomName] = useState("");
	const [category, setCategory]= useState('')
	let { room } = useParams();
	const categoryOptions = [
		"General",
		"Discussions",
		'Technology',
		'Entertainment',
		"Gaming",
		'Sports',
		'Books and Literature',
		"Travel",
		"Food and Cooking",
		"Health and Fitness",
		"Art and Creativity",
		"Science and Nature",
		"Politics and News",
		"Education",
		"Parenting",
		"Music and Instruments",
	]
	const handlePublicSubmit = () => {
			//do something
	}
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
					<div
						className={
							!privateRoom ? "question-wrapper" : "question-wrapper dark-mode"
						}>
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
											value={roomPassword}
											required
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
											Room <span style={{ color: "skyblue" }}>{room}</span> is
											<span style={{ color: "lightgreen", fontWeight: "800" }}>
												
												available!
											</span>
											
											<br></br> Create a free public room!
										</h4>
									</content>
									<label for='cetegory-list'>Category:</label>

									<select
										name='Category'
										id='category-list'
										onChange={(e) => setCategory(e.target.value)}>
										<option value=''>--Please choose an option--</option>
										{categoryOptions.map((cat) => {
											return <option value={cat}>{cat}</option>;
										})}
									</select>
								</div>
								{category !== "" && !privateRoom && (
									<div>
										<h3>
											The following information <br></br>{" "}
											<span style={{ color: "red" }}>
												{" "}
												<em>will be</em>
											</span>{" "}
											shared with the public.
										</h3>
										<div className={"private-info"}>
											<div id={"number-value"}>
												<label htmlFor={"number-value"}>room # </label>
												<input
													type='number'
													id={"number-value"}
													placeholder={room}
													style={{
														width: "50px",
														textAlign: "center",
														fontSize: "20px",
													}}
													readOnly
												/>
											</div>
											<div id={"name-value"}>
												<label htmlFor={"public-name"}>Created By @ </label>
												
												<input
													type='name'
													id={"public-name"}
													placeholder={userLoginInfo.username}
													style={{ width: "50px", textAlign: "center" }}
													readOnly
												/>
											</div>
										</div>
										<button
											type='submit'
											className={'submit-button'}
											onClick={() => handlePublicSubmit}
										>
											Create
										</button>
									</div>
								)}
							</>
						)}
					</div>
				</div>
			</form>
		</>
	);
};
export default CreateRoom;
