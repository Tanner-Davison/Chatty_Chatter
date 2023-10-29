import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";
import "./Header.css";

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
      },5000);
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
    <div className={"headerContainer"}>
      <ul className={"navLinks"}>
        <Link to="/">
          <h1 className={"logo-font"}>Chatty Chatter</h1>
        </Link>

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
          <h2 style={{ color: "white" }}>Public Search</h2>
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
      )}
      {visible && usernameLocal && (
        <div className={"visible_login_success"}>
          <h2 id="loggedIn">Logged in as: </h2>
          <h2 style={{ color: "white" }}>{usernameLocal}</h2>
        </div>
      )}
    </div>
  );
};

export default Header;
