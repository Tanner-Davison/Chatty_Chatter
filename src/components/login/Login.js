import { useState, useContext, useRef,useEffect } from "react";
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
  const [signUpToggle, setSignUpToggle] = useState(false);
  const [loginToggle, setLoginToggle] = useState(false);

  const signUp = () => {
    if (signUpToggle === false) {
      setLoginPortalToggle(false);
      return setSignUpToggle(true);
    } else {
      return setSignUpToggle(false);
    }
  };
  const loginmodal = () => {
    if (loginToggle === false) {
      setSignUpToggle(false);
      return setLoginToggle(true);
    } else {
      return setLoginToggle(false);
    }
  };
  const navigate = useNavigate();
  const handleLoginSuccess = (event) => {
    event.preventDefault();
    if (username.includes("@") & (username.length > 1)) {
      setMainAccess(false);
      setLoginPortalToggle(false);
    
    //   localStorage.setItem("password", JSON.stringify(password));
	  sessionStorage.setItem('username',JSON.stringify(username.toLowerCase()));
	  sessionStorage.setItem('password',JSON.stringify(password));
      submitHandler();
    }
    createUserInfo(username, password);
  };
  const userExists = JSON.parse(sessionStorage.getItem('username'))|| null;

  const submitHandler = (event) => {
    navigate("/currentservers");
  };
  useEffect(()=>{
	if(userExists != null){
		navigate('/currentservers')
	}
  })
  return (
    <>
      <div className={"login-element-wrapper"}>
        <Header />
        <form onSubmit={submitHandler}>
          <div className={"columnContainer"}>
            <div className={"new-user-header"}>
              <div className={"columnContainer"}>
                {signUpToggle && (
                  <>
                    <div className={"CreateUser"}>
                      <h2>Create Account</h2>
                      <div className={"userLoginElements"}>
                        <div className={"input-box-container"}>
                          <label htmlFor="username-id"> Username :</label>
                          <input
                            type="text"
                            name={"usernameInput"}
                            ref={inputElement}
                            onChange={(event) =>
                              setUsername(event.target.value)
                            }
                            id="username-id"
                          />
                        </div>
                        <div className={"input-box-container"}>
                          <label htmlFor="password-id"> Password :</label>
                          <input
                            type="text"
                            name={"passwordInput"}
                            onChange={(event) => {
                              setPassword(event.target.value);
                            }}
                            id="password-id"
                          />
                        </div>
                      </div>
                      <div className={"boxWrapper"}>
                        <button id="closeBtn" type="button" onClick={signUp}>
                          Back
                        </button>
                        <button
                          id="closeBtn"
                          type="submit"
                          onClick={handleLoginSuccess}>
                          Submit
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            {!loginToggle && !signUpToggle && (
              <>
                <div className={"titleChatty"}>
                  <h1 id="welcome_">Chatty - Chatter</h1>
                </div>
                <div className={"welcomeContainer"}>
                  <article>
                    Where the chats gets chatty! Build your own chat hubs, set up
                    your unique profile, and add your friends. Dive in, and let
                    Chatty-Chatter bring your chats to life.
                  </article>
                </div>

                <div className={"new-user-header"}>
                  {!signUpToggle && !loginToggle && (
                    <button id="closeBtn" type="button" onClick={signUp}>
                      New User
                    </button>
                  )}
                  {!loginToggle && (
                    <button id={"closeBtn"} type="button" onClick={loginmodal}>
                     Login
                    </button>
                  )}
                </div>
              </>
            )}
            {loginToggle === true && (
              <>
                <div className={"CreateUser"}>
                  <h2>User Login</h2>
                  <div className={"userLoginElements"}>
                    <div className={"input-box-container"}>
                      <label htmlFor="username-id"> Username :</label>
                      <input
                        type="text"
                        name={"usernameInput"}
                        ref={inputElement}
                        onChange={(event) => setUsername(event.target.value)}
                        id="username-id"
                      />
                    </div>
                    <div className={"input-box-container"}>
                      <label htmlFor="password-id"> Password :</label>
                      <input
                        type="text"
                        name={"passwordInput"}
                        onChange={(event) => {
                          setPassword(event.target.value);
                        }}
                        id="password-id"
                      />
                    </div>
                  </div>
                  <div className={"boxWrapper"}>
                    <button id="closeBtn" type="button" onClick={loginmodal}>
                      close
                    </button>
                    <button
                      id="closeBtn"
                      type="submit"
                      onClick={handleLoginSuccess}>
                      Login
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </form>
      </div>
    </>
  );
};
export default Login;
