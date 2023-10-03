import { useState, useEffect } from "react";
import "./App.css";
import MainRoom from "./components/MainRoom";
import Login from "./components/login/Login";
import io from "socket.io-client";
import { LoginContext } from "./components/contexts/LoginContext";

function App() {
  const [mainAccess, setMainAccess] = useState(false);
  const [loginPortalToggle, setLoginPortalToggle] = useState(true);
  const [socket, setSocket] = useState(null);
  const [userLoginInfo, setUserLoginInfo] = useState({
    username: "",
    password: "",
  });

  const socketHandler = () => {
    return setSocket(io.connect("http://localhost:3001"), {
      reconnection: true,
      reconnectionAttempts: 20,
      reconnectionDelay: 2000,
    });
  };
  const createUserInfo = (username, password) => {
    setUserLoginInfo({ username: username, password: password });

    return userLoginInfo;
  };
  useEffect(() => {
    console.log(userLoginInfo);
  }, [userLoginInfo]);

  return (
    <LoginContext.Provider
      value={{
        userLoginInfo,
        setUserLoginInfo,
        mainAccess,
        setMainAccess,
        loginPortalToggle,
        setLoginPortalToggle,
        socket,
        setSocket,
        createUserInfo,
      }}>
      <header className={"App"}>
        <div className={"App-body"}>
          {!mainAccess && (
            <>
              {loginPortalToggle === true ? (
                <Login
                  sendUserInfo={createUserInfo}
                  loginToggle={setLoginPortalToggle}
                />
              ) : (
                <button
                  className={"mainAccessBtn"}
                  onClick={() => {
                    setMainAccess(true);
                    socketHandler();
                  }}>
                  {" "}
                  Join Community Chatter
                </button>
              )}
            </>
          )}

          {mainAccess && (
            <MainRoom
              mainAccess={mainAccess}
              socket={socket}
              setMainAccess={setMainAccess}
              userInfo={userLoginInfo}
            />
          )}
        </div>
      </header>
    </LoginContext.Provider>
  );
}

export default App;
