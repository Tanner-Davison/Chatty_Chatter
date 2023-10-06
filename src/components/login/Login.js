import { useState, useContext } from "react";
import "./Login.css";
import { LoginContext } from "../contexts/LoginContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
	const {createUserInfo, setMainAccess, setLoginPortalToggle} = useContext(LoginContext)
	
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	const handleLoginSuccess =(event) =>{
		event.preventDefault();
		if(username.includes('@') & username.length > 1){
			setMainAccess(false);
			setLoginPortalToggle(false)
			submitHandler();
			
			localStorage.setItem('username', JSON.stringify(username))
			localStorage.setItem('password', JSON.stringify(password))
		}
		createUserInfo(username, password);

		
	}
	const submitHandler = (event) => {
	
		
		navigate("/currentservers");
		
	};
	return (
		<>
			<form onSubmit={submitHandler}>
				<h1>New to Chatty-Chatter? </h1>
				<h2>Create a Free Account!</h2>

				<div className={"CreateUser"}>
					<div className={"userLoginElements"}>
						<label htmlFor='username-id'> Create Username :</label>
						<input
							type='text'
							name={"usernameInput"}
							onChange={(event) => setUsername(event.target.value)}
							id='username-id'
						/>
					</div>

					<div className={"userLoginElements"}>
						<label htmlFor='password-id'> Create Password :</label>
						<input
							type='text'
							name={"passwordInput"}
							onChange={(event) => {
								setPassword(event.target.value);
							}}
							id='password-id'
						/>
					</div>

					<button
						className={"loginFormSubmitBtn"}
						type='submit'
						onClick={handleLoginSuccess}>
						Create New User
					</button>
				</div>
			</form>
		</>
	);
};
export default Login;
