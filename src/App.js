import { useState, useEffect } from "react";
import {useNavigate} from 'react-router-dom';
import "./App.css";
import MainRoom from "./components/MainRoom";
import Login from "./components/login/Login";
import CurrentServers from "./components/currentServers/CurrentServers";
import { LoginContext } from "./components/contexts/LoginContext";
import Header from "./components/Header/Header";
import Profile from "./components/Profile/Profile";
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
      </>
    )
  );
  const [mainAccess, setMainAccess] = useState(false);
  const [loginPortalToggle, setLoginPortalToggle] = useState(true);
  const [socket, setSocket] = useState(null);
  
  const [userLoginInfo, setUserLoginInfo] = useState({
    username: "",
    password: "",
    imageUrl: '',
    cloudinary_id:'' ,
  });
  
  const createUserInfo = async () => {
    const userLoggedIn = sessionStorage.getItem('active_user');
    const user = JSON.parse(userLoggedIn);
    if(user){
      const loggedInUser ={
        username:user.username,
        password:user.password,
        imageUrl:user.profilePic.url,
        cloudinary_id:user.profilePic.cloudinary_id,
      }
      setUserLoginInfo(loggedInUser);

      return userLoginInfo;
    }else{

      const newUserInfo = {
        username: JSON.parse(sessionStorage.getItem("username")),
        password: JSON.parse(sessionStorage.getItem("password")),
        imageUrl: sessionStorage.getItem('image-url'),
        cloudinary_id: sessionStorage.getItem('image-url'),
      };
        setUserLoginInfo(newUserInfo);
      
      return userLoginInfo;
    }
  };
  useEffect(() => {
    console.log(userLoginInfo);
    if (socket) {
      console.log(socket);
    }
    if (userLoginInfo.username === "") {
      createUserInfo();
    }
    // eslint-disable-next-line
  }, [userLoginInfo, socket]);

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
      <RouterProvider router={router}>
        <header className={"App"}>
          <div className={"App-body"}>
            <Header>
              <Login />
              <CurrentServers />
              <MainRoom />
              <Profile />
            </Header>
          </div>
        </header>
      </RouterProvider>
    </LoginContext.Provider>
  );
}

export default App;
