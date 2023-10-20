import "./Header.css";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";

const Header = ({ joinRoom, roomChanger, room, }) => {
  const location = useLocation();

  const usernameLocal = JSON.parse(sessionStorage.getItem("username"));
  const [visible, setVisible] = useState(true);
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
      const timer = setTimeout(()=>{
        setVisible(false);
      },5000);
       return () => {
         clearTimeout(timer);
       };
       
    },[room])
  
  const getLinkStyle = (path) => {
    return path === location.pathname ? "linkActive" : "linkInactive";
  };

  return (
    <div className={"headerContainer"}>
      <ul className={"navLinks"}>
        <Link to="/">
          <h1 className={"logo-font"}>Chatty Chatter</h1>
        </Link>

        {usernameLocal && (
          <>
            <li>
              <Link to={`/currentservers`}>
                <h2 className={getLinkStyle("/currentservers")}>SERVERS</h2>
              </Link>
            </li>
            <span style={{ color: "white" }}>|</span>
            <li>
              <Link to={`/profile/${usernameLocal}`}>
                <h2
                  className={getLinkStyle(
                    `/profile/${usernameLocal.split("@")[0]}`
                  )}>
                  PROFILE
                </h2>
              </Link>
            </li>
            <span style={{ color: "white" }}>|</span>
            <button
              type="button"
              id={"logout_button"}
              onClick={() => logoutHandler()}>
              Logout
            </button>
          </>
        )}
      </ul>
      {visible && usernameLocal && (
        <div className={"visible_login_success"}>
          <h2 id="loggedIn">Logged in as: </h2>
          <h2 style={{ color: "white" }}>{usernameLocal}</h2>
        </div>
      )}

      <div className={"create_room_container"}>
        <h2 style={{ color: "white" }}>Create Room</h2>
        <input
          className={"roomInput"}
          placeholder="Room #"
          onKeyDown={handleKeyDown}
          value={room}
          onChange={roomChanger}
        />
        <button className={"buttonHeader"} type="submit" onClick={joinRoom}>
          Join Room
        </button>
      </div>
    </div>
  );
};

export default Header;
