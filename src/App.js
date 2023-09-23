import { useState, useEffect } from "react";
import "./App.css";
import MainRoom from "./components/MainRoom";
import Login from "./components/login/Login";
function App() {
  const [mainAccess, setMainAccess] = useState(false);
  const [loginPortalToggle, setLoginPortalToggle] = useState(true);
  const [userLoginInfo, setUserLoginInfo] = useState({
    username: "",
    password: "",
  });
  const createUserInfo = (username, password) => {
    setUserLoginInfo({ username: username, password: password });
    return userLoginInfo;
  };
  useEffect(() => {
    console.log(userLoginInfo);
  }, [userLoginInfo]);

  return (
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
                }}>
                {" "}
                Join Community Chatter
              </button>
            )}
          </>
        )}

        {mainAccess && (
          <MainRoom mainAccess={mainAccess} setMainAccess={setMainAccess} />
        )}
      </div>
    </header>
  );
}

export default App;
