import styles from "./PrivateRoomAccess.module.css";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useState } from "react";
import axios from 'axios';
import Button from "@mui/material/Button";
const PrivateRoomAccess = ({roomData, setIsPrivateRoom}) => {
	console.log(roomData)
    const PORT = process.env.REACT_APP_PORT;
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);
	const [password, setPassword] = useState("");
    const [isError, setIsError] = useState(false)

    const handlePasswordSubmit = async(e) => {
        console.log(roomData.private_room_password)
        e.preventDefault();
       if(password === null || roomData.private_room_password=== null || roomData.room_number=== null){
		return
	   }
        axios.get(`${PORT}/password_check/`, {
            params: {
                password: password,
                room: roomData.room_number,
                roomPassword: roomData.private_room_password,
                    }
            })
            .then((res) => {
                console.log(res.data.message)
                if (res.data.message === 'success') {
                    console.log('niggas we made it ')
                    setIsError(false)
                    setIsPrivateRoom(false)
                } else {
                    console.log('we have an error')
                }
            }).catch((err) => {
                if (err.response && err.response.status === 404) {
                    setIsError(true)
                } else {
                    console.log('an error occured in privateRoomAccess catch block')
                }
            })
        
        }
	return (
		<div className={styles.private_room_main_wrapper}>
			<p id={styles.align_self}>This room requires a password</p>
			<label
				id={styles.password_input}
				htmlFor={"passwordInput"}>
				{isPasswordVisible ? (
					<Visibility
						id={styles.eye_ball}
						onClick={() => setIsPasswordVisible(false)}
					/>
				) : (
					<VisibilityOff
						id={styles.eye_ball}
						onClick={() => setIsPasswordVisible(true)}
					/>
				)}

				<input
					type={isPasswordVisible ? "text" : "password"}
					onChange={(e) => setPassword(e.target.value)}
					placeholder=' enter password'
					id={"passwordInput"}
				/>
				{!isError && (
					<Button
						variant='outlined'
						id={styles.submit_button}
						onClick={(e) => handlePasswordSubmit(e)}>
						Enter
					</Button>
				)}
				{isError && (
					<Button
                        variant='outlined'
                        id={styles.submit_button}
						color='error'
						onClick={(e) => handlePasswordSubmit(e)}>
						Invalid
					</Button>
				)}
			</label>
		</div>
	);
};
export default PrivateRoomAccess;
