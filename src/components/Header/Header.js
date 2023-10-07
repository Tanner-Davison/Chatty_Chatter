import "./Header.css";
import { LoginContext } from "../contexts/LoginContext";
import { useContext } from "react";

const Header = ({ joinRoom, roomChanger, room }) => {
  const { userLoginInfo } = useContext(LoginContext);
  return (
    <div className={"headerContainer"}>
      <h2 style={{ color: "white" }}>{userLoginInfo.username  || `Please login`} </h2>

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
