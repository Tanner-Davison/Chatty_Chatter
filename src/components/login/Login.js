import { useState } from "react";
import './Login.css';


const Login = ({sendUserInfo, loginToggle}) =>{
const [username, setUsername] =useState('');
const [password, setPassword] = useState('');

const submitHandler =(event) =>{
    event.preventDefault();
    sendUserInfo(username,password);

    loginToggle('false')
}
    return (
      <>
        <form onSubmit={submitHandler}>
          <h1>New to Chatty-Chatter? </h1>
          <h2>Create a Free Account!</h2>

          <div className={'CreateUser'}>
            <div className={"userLoginElements"}>
              <label htmlFor="username-id"> Create Username :</label>
              <input type="text" name={"usernameInput"} onChange={event=>setUsername(event.target.value)}id="username-id" />
            </div>

            <div className={"userLoginElements"}>
              <label htmlFor="password-id"> Create Password :</label>
              <input type="text" name={"passwordInput"} onChange={(event)=>{setPassword(event.target.value)}}id="password-id" />
            </div>

            <button className={'loginFormSubmitBtn'}type="submit"onClick={submitHandler}>Create New User</button>
          </div>
          
        </form>
      </>
    );

}
export default Login;