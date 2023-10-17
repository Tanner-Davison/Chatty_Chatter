import { useState, useContext, useRef, useEffect } from "react";
import "./Login.css";
import { LoginContext } from "../contexts/LoginContext";
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import axios from "axios";
const Login = () => {
  const { createUserInfo, setMainAccess, setLoginPortalToggle } =
    useContext(LoginContext);

  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState("");
  const inputElement = useRef(null);
  const [signUpToggle, setSignUpToggle] = useState(false);
  const [loginToggle, setLoginToggle] = useState(false);
  const [image, setImage] = useState(null);
  const userExists = JSON.parse(sessionStorage.getItem("username")) || null;
  const navigate = useNavigate();

  const toggleSignUp = () => {
    setSignUpToggle(!signUpToggle);
    setLoginPortalToggle(signUpToggle);
  };
  const loginmodal = () => {
    setLoginToggle(!loginToggle);
  };

  const handleCreateUser = async (event) => {
    event.preventDefault();
    if (username.includes("@") & (username.length > 1)) {
      setMainAccess(false);
      setLoginPortalToggle(false);

      sessionStorage.setItem(
        "username",
        JSON.stringify(username.toLowerCase())
      );
      sessionStorage.setItem("password", JSON.stringify(password));

      const sessionUsername = await JSON.parse(
        sessionStorage.getItem("username")
      );
      setUsername(sessionUsername.toLowerCase());

      if (image) {
        const formData = new FormData();
        formData.append("image", image);
        formData.append("username", username);
        formData.append("password", password);
        // console.log("Sending FormData:",
        //   {
        //     username: formData.get("username"),
        //     password: formData.get("password"),
        //     image: formData.get("image"),
        //   });
        const response = await fetch("http://localhost:3001/signup", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();

        if (data && data.image && data.image.url) {
          sessionStorage.setItem("image-url", data.image.url);
          sessionStorage.setItem("cloudinary_id", data.image.cloudinary_id);
          createUserInfo();
        }
      }
      submitHandler();
    }
  };
  const handleLoginSuccess = async (event) => {
    event.preventDefault();
    setUsername(username.toLowerCase());
    try{   
      const findUser = await axios.post(`http://localhost:3001/login`,{
        username: username.toLowerCase(),
        password: password,
      });
      const userExist = findUser.data;
      console.log(userExist.username);
      sessionStorage.setItem('active_user',JSON.stringify(userExist))
      createUserInfo()
      const storedUsername = username.toLowerCase();
      sessionStorage.setItem(
        "username",
        JSON.stringify(storedUsername)
      );
    }catch(error){
      console.error(`Error found in LOGIN/handleLoginSuccess `, error.userExist)
    }finally{
      submitHandler();
    }
  };
  const submitHandler = () => {
    navigate("/currentservers");
  };

  useEffect(() => {
    if (userExists != null ) {
      navigate(`/profile/${userExists.split('@')[0]}`);
    }
  });
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
                      <div className="file_upload">
                        <input
                          type="file"
                          accept="image/png, image/jpeg"
                          name="image"
                          onChange={(e) => setImage(e.target.files[0])}
                        />
                        <button>upload photo</button>
                      </div>
                      {/* PHOTO UPLOAD HERE */}
                      <div className={"boxWrapper"}>
                        <button
                          id="closeBtn"
                          type="button"
                          onClick={toggleSignUp}>
                          Back
                        </button>
                        <button
                          id="closeBtn"
                          type="submit"
                          onClick={handleCreateUser}>
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
                    Where the chats gets chatty! Build your own chat hubs, set
                    up your unique profile, and add your friends. Dive in, and
                    let Chatty-Chatter bring your chats to life.
                  </article>
                </div>

                <div className={"new-user-header"}>
                  {!signUpToggle && !loginToggle && (
                    <button id="closeBtn" type="button" onClick={toggleSignUp}>
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
                  <div className={"btnWrapper"}>
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
