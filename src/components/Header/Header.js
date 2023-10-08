import "./Header.css";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {useParams} from 'react-router-dom';

const Header = ({ joinRoom, roomChanger, room, socket }) => {
  const location = useLocation();
  const usernameLocal = JSON.parse(localStorage.getItem("username"));
    
  const getLinkStyle = (path) => {
    return path === location.pathname ? "linkActive" : "linkInactive";
  };

  return (
    <div className={"headerContainer"}>
      <ul className={"navLinks"}>
        <li>
          <Link to={"/"}>
            <h2 className={getLinkStyle("/")}>HOME</h2>
          </Link>
        </li>
        <li>
          <Link to="/currentservers">
            <h2 className={getLinkStyle("/currentservers")}>SERVERS</h2>
          </Link>
        </li>
        <li>
          <Link to={`/profile/${usernameLocal}`}>
            {" "}
            {/* Assuming this is the correct path for PROFILE */}
            <h2 className={getLinkStyle(`/profile/${usernameLocal}`)}>PROFILE</h2>
          </Link>
        </li>
      </ul>

      <h2 style={{ color: "white" }}>
        {usernameLocal ? usernameLocal : `Create Account or Login`}{" "}
      </h2>
      <div className={"room-num-input"}>
        <h2 style={{ color: "white" }}>create Your own server!</h2>
        <input placeholder="Room #" value={room} onChange={roomChanger} />
        <button type="submit" onClick={joinRoom}>
          Join Room
        </button>
      </div>
    </div>
  );
};

export default Header;
