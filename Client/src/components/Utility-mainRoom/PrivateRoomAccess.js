import styles from "./PrivateRoomAccess.module.css";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useState, useContext } from "react";
import { LoginContext } from "../contexts/LoginContext";
import axios from 'axios';
import Button from "@mui/material/Button";
import { io } from "socket.io-client";
const PrivateRoomAccess = ({roomData, setIsPrivateRoom}) => {
	const { setMainAccess, setSocket, userLoginInfo } =
	useContext(LoginContext);
  const PORT = process.env.REACT_APP_API_URL || 5000;

	const [isPasswordVisible, setIsPasswordVisible] = useState(false);
	const [password, setPassword] = useState("");
    const [isError, setIsError] = useState(false)

    const handlePasswordSubmit = async() => {
       
       if(password === null || roomData.private_room_password=== null || roomData.room_number=== null){
		return setIsError(true)
	   }
        axios.get(`/password_check/`, {
            params: {
                password: password,
                room: roomData.room_number,
                roomPassword: roomData.private_room_password,
				roomName: roomData.room_name,
				username: userLoginInfo.username,
                    }
            })
            .then((res) => {
                if (res.data.message === 'success') {
                    console.log('Access Granted')
                    setIsError(false)
                    setIsPrivateRoom(false)
					handlLoginSuccess(roomData.room_number)
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
		 const handlLoginSuccess = (room,event) => {
      
       setMainAccess(true);
       setSocket(io.connect(`/`), {
         reconnection: true,
         reconnectionAttempts: 20,
         reconnectionDelay: 2000,
       });
       sessionStorage.setItem("lastRoom", room);
     }; 
	 const handleOnChange =(e)=>{
		if(password === '' || null){
			setIsError(false)
		}
		setPassword(e.target.value)
	 }
	return (
    <div
      className={`${styles.private_room_main_wrapper} ${
        isError ? styles.errorClass : ""
      }`}>
      <p id={styles.align_self}>Password Required </p>
      <label id={styles.password_input} htmlFor={"passwordInput"}>
        {isPasswordVisible ? (
          <Visibility
            id={styles.eye_ball}
            onClick={() => setIsPasswordVisible(false)}
            style={isError ? { color: "crimson" } : { color: "white" }}
          />
        ) : (
          <VisibilityOff
            id={styles.eye_ball}
            onClick={() => setIsPasswordVisible(true)}
            style={isError ? { color: "maroon" } : { color: "white" }}
          />
        )}

        <input
          type={isPasswordVisible ? "text" : "password"}
          onChange={(e) => handleOnChange(e)}
          placeholder=" enter password"
          id={"passwordInput"}
        />
        {!isError && (
          <Button
            variant="outlined"
            id={styles.submit_button}
            onClick={handlePasswordSubmit}>
            Enter
          </Button>
        )}
        {isError && (
          <Button
            variant="outlined"
            id={styles.submit_button}
            color="error"
            onClick={handlePasswordSubmit}>
            Invalid
          </Button>
        )}
      </label>
    </div>
  );
};
export default PrivateRoomAccess;
