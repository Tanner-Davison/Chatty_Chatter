import { useState, useContext, useRef, useEffect } from "react";
import "./Login.css";
import { LoginContext } from "../contexts/LoginContext";
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import axios from "axios";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const Login = () => {
  const { createUserInfo, setLoginPortalToggle } = useContext(LoginContext);

  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState("");
  const inputElement = useRef(null);
  const [signUpToggle, setSignUpToggle] = useState(false);
  const [loginToggle, setLoginToggle] = useState(false);
  const [image, setImage] = useState(null);
  const [loginFailed, setLoginFailed] = useState(false);
  const [errorCss, setErrorCss] = useState("");
  const PORT = process.env.REACT_APP_API_URL || 5000 ;
  const userExists = JSON.parse(sessionStorage.getItem("username")) || null;
  const [parentBackgroundColor, setParentBackgroundColor] = useState("gray");
  const [resError, setResError] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const navigate = useNavigate();

  const toggleSignUp = () => {
    setSignUpToggle(!signUpToggle);
    setLoginPortalToggle(signUpToggle);
  };
  const handleKeyDown = (event) => {
    if (event.keyCode === 32) {
      event.preventDefault();
    }
  };
  const loginmodal = () => {
    setLoginToggle(!loginToggle);
  };

  const handleCreateUser = async (event) => {
    event.preventDefault();
    if (!username || !password) {
      return setLoginFailed(true);
    }
    if (username.length > 1) {
      setUsername(username.toLowerCase());
    } else {
      return setLoginFailed(true);
    }
    if (image != null) {
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
      axios
        .post(`/signup`, formData)
        .then((res) => {
          const data = res.data;

          if (data.message === "User created!") {
            sessionStorage.setItem("image-url", data.image.url);
            sessionStorage.setItem("cloudinary_id", data.image.cloudinary_id);
            sessionStorage.setItem(
              "password",
              JSON.stringify(data.hashedPassword)
            );
            sessionStorage.setItem(
              "username",
              JSON.stringify(username.toLowerCase())
            );
            createUserInfo();
          } else {
            return setLoginFailed(true);
          }
          submitHandler();
        })
        .catch((error) => {
          if (axios.isAxiosError(error)) {
            console.error("Axios error:", error.message);
            console.log("Status code:", error.response?.status);

            setParentBackgroundColor("gray");
            setResError(true);
            setErrorCss("error-css");
            return;
          }
        });
    } else {
      return setLoginFailed(true);
    }
  };
  const handleLoginSuccess = async (event) => {
    event.preventDefault();
    if (!username || !password) {
      return setLoginFailed(true);
    }
    setUsername(username.toLowerCase());
    try {
      const findUser = await axios.post(`/login/`, {
        username: username.toLowerCase(),
        password: password,
      });
      const userExist = await findUser.data;
      if (userExist.username === username.toLowerCase()) {
        const storedUsername = userExist.username;
        console.log(userExist.profilePic.url);
        setLoginFailed(false);
        sessionStorage.setItem("active_user", JSON.stringify(userExist));
        sessionStorage.setItem("username", JSON.stringify(storedUsername));
        createUserInfo();
        submitHandler();
      } else {
        setLoginFailed(true);
        setResError(true);
      }
    } catch (error) {
      console.error(`error @ LOGIN--> HandleLoginSuccess`);
      console.error(error);
      setLoginFailed(true);
    }
  };
  const submitHandler = () => {
    navigate("/currentservers");
  };

  const handleAnimationEnd = () => {
    setParentBackgroundColor("#00bb2d");
  };
  useEffect(() => {
    if (userExists != null) {
      navigate(`/profile/${userExists.split("@")[0]}`);
    }
  });
  useEffect(() => {
    resError && setResError(null);
    //eslint-disable-next-line
  }, []);
  useEffect(() => {
    if (loginFailed) {
      setErrorCss("error-css");
      console.log("error css is working");
    } else if (loginFailed === false) {
      setErrorCss("");
      setResError("");
    }
  }, [loginFailed, errorCss]);
  useEffect(() => {
    image && console.log(image);
    console.log(resError);

    //eslint-disable-next-line
  }, []);
  return (
    <>
      <Header />
      <div className={"login-element-wrapper"}>
        <div className={"columnContainer"}>
          <form className={"new-user-header"} onSubmit={submitHandler}>
            {!loginToggle && !signUpToggle && (
              <>
                <div className={"titleChatty"}>
                  {/* <img
                    className={"speach-bubble"}
                    src={speachBubble}
                    alt={"background"}></img> */}
                  <h1 id="chatty">Chatty</h1>
                  <h1 id="chatty">Chatter</h1>
                </div>

                <div className={"welcomeContainer"}>
                  <article>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      Welcome ,
                    </span>
                    Where the chatter gets chatty! Build your own chat hubs, set
                    up your unique profile, and add your friends. Dive in, and
                    let <span id={"inline-font-change"}>Chatty-Chatter</span>{" "}
                    bring your chats to life.
                  </article>
                  {!signUpToggle && !loginToggle && (
                    <div className={"login-button-wrapper home"}>
                      <button
                        id="closeBtn"
                        type="button"
                        onClick={toggleSignUp}
                      >
                        New User
                      </button>

                      <button
                        id={"closeBtn"}
                        type="button"
                        onClick={() => {
                          loginmodal();
                        }}
                      >
                        Login
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            {signUpToggle && (
              <>
                <fieldset>
                  <legend>
                    {" "}
                    <h2>Create Profile</h2>{" "}
                  </legend>
                  <div className="create_account_h2">
                    <div
                      className={
                        !image
                          ? `create_user  ${errorCss}`
                          : `create_user image-added ${errorCss}`
                      }
                      style={{
                        backgroundColor: parentBackgroundColor,
                      }}
                    >
                      <div className={"userLoginElements"}>
                        <div className={"input-box-container"}>
                          {resError && (
                            <div className={"error-message"}>
                              <p>Username taken. Login or Try again.</p>
                            </div>
                          )}
                          <label htmlFor="username-id"> Username</label>
                          <input
                            id={"login-input"}
                            type="text"
                            onKeyDown={handleKeyDown}
                            className={"usernameInput"}
                            ref={inputElement}
                            onChange={(event) => {
                              setUsername(event.target.value);
                              setLoginFailed(false);
                              setResError(null);
                            }}
                          />
                        </div>
                        <div className={"input-box-container"}>
                          <label htmlFor="password-id" id={"login-input"}>
                            Password
                            <span id={"password-span"}>
                              {!passwordVisible && (
                                <VisibilityOff
                                  id={"visibility"}
                                  onClick={() => setPasswordVisible(true)}
                                />
                              )}
                              {passwordVisible && (
                                <Visibility
                                  id={"visibility"}
                                  onClick={() => setPasswordVisible(false)}
                                />
                              )}{" "}
                              <input
                                id={"login-input"}
                                required={true}
                                type={passwordVisible ? "text" : "password"}
                                name={"passwordInput"}
                                onKeyDown={handleKeyDown}
                                onChange={(event) => {
                                  setPassword(event.target.value);
                                }}
                              />
                            </span>
                          </label>
                        </div>
                      </div>

                      <div className="file_upload">
                        <div className={"uploaded_div"}>
                          <label htmlFor="fileUpload">Upload Photo</label>
                          <input
                            id={"login-input"}
                            className={"photo-upload_buttons"}
                            type="file"
                            accept="image/png, image/jpeg"
                            name="image"
                            title="Add Image"
                            onChange={(e) => setImage(e.target.files[0])}
                          />
                        </div>
                      </div>
                      <div
                        className={
                          !image
                            ? "image-previewer"
                            : `image-previewer image-exist`
                        }
                        style={
                          image
                            ? {
                                animation:
                                  "imageExistAnimation .8s ease-in-out",
                              }
                            : {}
                        }
                        onAnimationEnd={handleAnimationEnd}
                      >
                        {image && (
                          <img
                            id={"image-self"}
                            loading={"lazy"}
                            src={URL.createObjectURL(image)}
                            alt={"img-previewer"}
                            height={100}
                          ></img>
                        )}
                      </div>
                    </div>

                    {/* PHOTO UPLOAD HERE */}

                    <div className={"login-button-wrapper"}>
                      <button
                        id="closeBtn"
                        type="button"
                        onClick={() => {
                          setLoginFailed(false);
                          toggleSignUp();
                        }}
                      >
                        Back
                      </button>
                      <button
                        id="closeBtn"
                        type="submit"
                        onClick={handleCreateUser}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </fieldset>
              </>
            )}

            {loginToggle === true && (
              <>
                <fieldset>
                  <legend>
                    {" "}
                    <h2>User Login</h2>
                  </legend>
                  <div className="create_account_h2">
                    <div className={`create_user ${errorCss}`}>
                      <div className={`userLoginElements`}>
                        <div className={"input-box-container"}>
                          <label htmlFor="username-id"> Username </label>
                          <input
                            id={"login-input"}
                            type="text"
                            name={"usernameInput"}
                            onKeyDown={handleKeyDown}
                            ref={inputElement}
                            onChange={(event) => {
                              setUsername(event.target.value);
                              setLoginFailed(false);
                            }}
                          />
                        </div>
                        <div className={"input-box-container"}>
                          <label htmlFor="password-id" id={"login-input"}>
                            Password
                            <span id={"password-span"}>
                              {!passwordVisible && (
                                <VisibilityOff
                                  id={"visibility"}
                                  onClick={() => setPasswordVisible(true)}
                                />
                              )}
                              {passwordVisible && (
                                <Visibility
                                  id={"visibility"}
                                  onClick={() => setPasswordVisible(false)}
                                />
                              )}{" "}
                              <input
                                id={"login-input"}
                                required={"true"}
                                type={passwordVisible ? "text" : "password"}
                                name={"passwordInput"}
                                onKeyDown={handleKeyDown}
                                onChange={(event) => {
                                  setPassword(event.target.value);
                                }}
                              />
                            </span>
                          </label>
                        </div>
                      </div>
                      {loginFailed &&
                        setTimeout(() => setLoginFailed(false), 9000) && (
                          <div className={"login-failed"}>
                            Login Failed. Please Try Again.
                          </div>
                        )}
                    </div>
                    <div className={"login-button-wrapper"}>
                      <button
                        id="closeBtn"
                        type="button"
                        onClick={() => {
                          setErrorCss("");
                          setResError("");
                          setLoginFailed(false);
                          loginmodal();
                        }}
                      >
                        close
                      </button>
                      <button
                        id="closeBtn"
                        type="submit"
                        onClick={handleLoginSuccess}
                      >
                        Login
                      </button>
                    </div>
                  </div>
                </fieldset>
              </>
            )}
          </form>
        </div>
      </div>
    </>
  );
};
export default Login;
