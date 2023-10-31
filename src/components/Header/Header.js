import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import "./Header.css";
import searchGlass from './svgs/searchGlass.svg'
const Header = ({ joinRoom, roomChanger, room, }) => {
  const usernameLocal = JSON.parse(sessionStorage.getItem("username"));
  const currentLocation = window.location.href.toString();
  const [visible, setVisible] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  
   const handleKeyDown = (event) => {
     if (event.keyCode === 32) {
       event.preventDefault();
     }
   };
  const logoutHandler = () => {
    localStorage.clear();
    sessionStorage.clear();
    
    navigate("/");
  };
    useEffect(()=>{
      console.log(currentLocation);
      const timer = setTimeout(()=>{
        setVisible(false);
      },50000);
       return () => {
         clearTimeout(timer);
       };
    },[room])
  
  const getLinkStyle = (path) => {
    if (path.includes('/createroom') && location.pathname.includes('/createroom')) {
      return 'linkActive'
    }
    return path === location.pathname ? "linkActive" : "linkInactive";
  };

  return (
    <div
      className={
        currentLocation === "http://localhost:3000/"
          ? "headerContainer home"
          : "headerContainer other"
      }>
      
          <h1 className={"logo-font"}>Chatty Chatter</h1>
     
      <ul className={"navLinks"}>
        {usernameLocal && (
          <>
            <li>
              <Link to={`/profile/${usernameLocal}`}>
                <h2
                  className={getLinkStyle(
                    `/profile/${usernameLocal.split("@")[0]}`
                  )}>
                  Profile
                </h2>
              </Link>
            </li>
            <br></br>
            <span id={"span-id"} style={{ color: "white" }}>
              {" "}
              |{" "}
            </span>
            <li>
              <Link to={`/currentservers`}>
                <h2 className={getLinkStyle("/currentservers")}>All Rooms</h2>
              </Link>
            </li>
            <br></br>
            <span id={"span-id"} style={{ color: "white" }}>
              |
            </span>
            <li>
              <Link to={`/createroom/${0}`}>
                <h2 className={getLinkStyle(`/createroom/${Number}`)}>
                  Create-Hub
                </h2>
              </Link>
            </li>
            <br></br>
            <span id={"span-id"} style={{ color: "white" }}>
              |
            </span>
            <button
              type="button"
              id={"logout_button"}
              onClick={() => logoutHandler()}>
              Logout
            </button>
          </>
        )}
      </ul>
      {usernameLocal && currentLocation.includes("chatroom") && (
        <div className={"create_room_container"}>
          <h2 style={{ color: "white" }}>Hub Finder</h2>
          <input
            className={"roomInput"}
            placeholder="Room #"
            onKeyDown={handleKeyDown}
            value={room}
            onChange={roomChanger}
          />
          <button className={"buttonHeader"} type="submit" onClick={joinRoom}>
            <img src={searchGlass} alt={"search hub"} />
            Search
          </button>
        </div>
      )}
      {visible && usernameLocal && !currentLocation.includes("chatroom") && (
        <div className={"visible_login_success"}>
          <p id="loggedIn">Logged in as: </p>
          <p style={{ color: "white" }}>{"@" + usernameLocal}</p>
        </div>
      )}
    </div>
  );
};

export default Header;
