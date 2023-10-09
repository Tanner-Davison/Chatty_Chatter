import "./Header.css";

import { Link, useLocation, useNavigate } from "react-router-dom";

const Header = ({ joinRoom, roomChanger, room, socket }) => {
  const location = useLocation();

  const usernameLocal = JSON.parse(localStorage.getItem("username"));
  const navigate = useNavigate();
  const logoutHandler = () => {
    localStorage.clear();
    navigate("/");
  };
  const getLinkStyle = (path) => {
    return path === location.pathname ? "linkActive" : "linkInactive";
  };

  return (
    <div className={"headerContainer"}>
      <ul className={"navLinks"}>
        <Link to="/">
          <h1 className={"logo-font"}>Chatty Chatter</h1>
        </Link>
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
            <h2 className={getLinkStyle(`/profile/${usernameLocal}`)}>
              PROFILE
            </h2>
          </Link>
        </li>
        <button type="button" onClick={() => logoutHandler()}>
          LOGOUT
        </button>
      </ul>

      <h2 style={{ color: "white" }}>{usernameLocal ? usernameLocal : ``}</h2>
      <div className={"room-num-input"}>
        <h2 style={{ color: "white" }}>Create Room</h2>
        <input
          className={"roomInput"}
          placeholder="Room #"
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
