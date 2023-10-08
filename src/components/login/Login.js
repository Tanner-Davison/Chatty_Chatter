import { useState, useContext,useRef } from "react";
import "./Login.css";
import { LoginContext } from "../contexts/LoginContext";
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";
const Login = () => {
  const { createUserInfo, setMainAccess, setLoginPortalToggle } =
    useContext(LoginContext);

  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState("");
  const inputElement = useRef(null);

  const navigate = useNavigate();
  const handleLoginSuccess = (event) => {
    event.preventDefault();
    if (username.includes("@") & (username.length > 1)) {
      setMainAccess(false);
      setLoginPortalToggle(false);
      localStorage.setItem('username', JSON.stringify(username.toLowerCase()));
      localStorage.setItem("password", JSON.stringify(password));
	  submitHandler();
    }
    createUserInfo(username, password);
  };
  const submitHandler = (event) => {
    navigate("/currentservers");
  };
  return (
    <>
      <div className={'login-element-wrapper'}>
        <Header/>
        <form onSubmit={submitHandler}>
          <div className={"columnContainer"}>
            <div className={"new-user-header"}>
              <h2>Create New Account</h2>
            </div>
            <div className={"CreateUser"}>
              <div className={"userLoginElements"}>
                <label htmlFor="username-id"> Create Username :</label>
                <input
                  type="text"
                  name={"usernameInput"}
                  ref={inputElement}
                  //   onClick={()=>{focusInput()}}
                  onChange={(event) => setUsername(event.target.value)}
                  id="username-id"
                />
              </div>

              <div className={"userLoginElements"}>
                <label htmlFor="password-id"> Create Password :</label>
                <input
                  type="text"
                  name={"passwordInput"}
                  onChange={(event) => {
                    setPassword(event.target.value);
                  }}
                  id="password-id"
                />
              </div>

              <button
                className={"loginFormSubmitBtn"}
                type="submit"
                onClick={handleLoginSuccess}>
                Create Account
              </button>
            </div>
          </div>
          <div className={"columnContainer"}>
            <div className={"new-user-header"}>
              <h2>Login</h2>
            </div>
            <div className={"CreateUser"}>
              <div className={"userLoginElements"}>
                <label htmlFor="username-id"> Create Username :</label>
                <input
                  type="text"
                  name={"usernameInput"}
                  ref={inputElement}
                  //   onClick={()=>{focusInput()}}
                  onChange={(event) => setUsername(event.target.value)}
                  id="username-id"
                />
              </div>

              <div className={"userLoginElements"}>
                <label htmlFor="password-id"> Create Password :</label>
                <input
                  type="text"
                  name={"passwordInput"}
                  onChange={(event) => {
                    setPassword(event.target.value);
                  }}
                  id="password-id"
                />
              </div>

              <button
                className={"loginFormSubmitBtn"}
                type="submit"
                onClick={handleLoginSuccess}>
                Login
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};
export default Login;
