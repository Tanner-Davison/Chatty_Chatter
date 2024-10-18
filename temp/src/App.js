import { useState, useEffect } from "react";
import "./App.css";
import MainRoom from "./components/MainRoom";
import Login from "./components/login/Login";
import CurrentServers from "./components/currentServers/CurrentServers";
import { LoginContext } from "./components/contexts/LoginContext";
import Profile from "./components/Profile/Profile";
import CreateRoom from "./components/Utility-mainRoom/CreateRoom";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<Login />} />
        <Route path="/currentservers" element={<CurrentServers />} />
        <Route path="/chatroom/:room" element={<MainRoom />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/createroom/:room" element={<CreateRoom />} />
      </>
    )
  );
  const [mainAccess, setMainAccess] = useState(false);
  const [loginPortalToggle, setLoginPortalToggle] = useState(true);
  const [socket, setSocket] = useState(null);

  const [userLoginInfo, setUserLoginInfo] = useState({
    username: "",
    password: "",
    imageUrl: "",
    cloudinary_id: "",
  });

  const createUserInfo = async () => {
    const userLoggedIn = sessionStorage.getItem("active_user");
    const user = JSON.parse(userLoggedIn);
    if (user) {
      const loggedInUser = {
        username: user.username,
        password: user.password,
        imageUrl:
          user.profilePic.url ||
          "https://m.media-amazon.com/images/I/71zTE0u2iXL._AC_UY1000_.jpg",
        cloudinary_id:
          user.profilePic.cloudinary_id ||
          "https://m.media-amazon.com/images/I/71zTE0u2iXL._AC_UY1000_.jpg",
      };
      setUserLoginInfo(loggedInUser);
    } else {
      const newUserInfo = {
        username: JSON.parse(sessionStorage.getItem("username")),
        password: JSON.parse(sessionStorage.getItem("password")),
        imageUrl: sessionStorage.getItem("image-url"),
        cloudinary_id: sessionStorage.getItem("cloudinary_id"),
      };
      setUserLoginInfo(newUserInfo);
    }
  };
  useEffect(() => {
    if (userLoginInfo.username === "") {
      createUserInfo();
    }
    // eslint-disable-next-line
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
      <RouterProvider router={router}></RouterProvider>
    </LoginContext.Provider>
  );
}

export default App;
