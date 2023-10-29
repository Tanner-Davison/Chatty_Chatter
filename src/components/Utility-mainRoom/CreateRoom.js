import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../contexts/LoginContext";
import toggleOff from "./svgs/toggleOff.svg";
import { useParams } from "react-router-dom";
import toggleOn from "./svgs/toggleOn.svg";
import lockOpen from "./svgs/lockOpen.svg";
import CategoryOptions from "./categoryOptions";
import locked from "./svgs/locked.svg";
import Header from "../Header/Header";
import build from "./svgs/build.svg";
import "./CreateRoom.css";
import axios from "axios";
import searchGlass from "./svgs/searchGlass.svg";
import dropdown from "./svgs/dropdown.svg";
const CreateRoom = (props) => {
  const { userLoginInfo } = useContext(LoginContext);
  const [roomPassword, setRoomPassword] = useState("");
  const [privateRoom, setPrivateRoom] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [roomName, setRoomName] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [roomTaken, setRoomTaken] = useState(Boolean);
  const [category, setCategory] = useState("");
  const PORT = process.env.REACT_APP_PORT;
  const navigate = useNavigate();
  let { room } = useParams();
  const categoryKeys = Object.keys(CategoryOptions);

  const handlePublicSubmit = async () => {
    const newPublicRoom = {
      category: category,
      room: searchValue,
      createdBy: userLoginInfo.username,
    };
    axios.post(`${PORT}/new-room-creation`, newPublicRoom);
  };
  const handleRoomAvailability = async (numberValue) => {
    if (numberValue === "") {
      return;
    }
    const roomAvailable = await axios.get(
      `${PORT}/availability/${numberValue}`
    );
    if (roomAvailable.data.room === true) {
      setRoomTaken(true);
    } else if (roomAvailable.data.room === false) {
      setRoomTaken(false);
      navigate(`/createroom/${numberValue}`);
    }
  };

  const handleInputChange = (event) => {
    setPassword(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      setIsPasswordVisible(!isPasswordVisible);
    }
  };

  return (
    <>
      <Header />

      <form className={"form-wrapper"}>
        <div className={"wrapper"}>
          <div id={"header-border"}>
            <h2>Room</h2>
            <img src={build} alt={"icon"} height={40} />
            <h2>Builder</h2>
          </div>
          <div
            className={
              !privateRoom ? "question-wrapper" : "question-wrapper dark-mode"
            }>
            <div className={"toggle-wrapper"}>
              <p
                style={{ borderColor: "white" }}
                className={privateRoom ? "public-off true" : "public-off"}>
                Public
              </p>
              <img
                src={lockOpen}
                alt={"lock open icon"}
                style={!privateRoom ? { opacity: "100" } : { opacity: "0" }}
              />
              <img
                src={privateRoom ? toggleOff : toggleOn}
                alt={"toggleOff"}
                height={60}
                className={"toggleSvg"}
                onClick={() => setPrivateRoom(!privateRoom)}
              />
              <span>
                <img
                  src={locked}
                  alt={"lock open icon"}
                  className={"material-icon"}
                  style={
                    privateRoom
                      ? { opacity: "100", fill: "black" }
                      : { opacity: "0" }
                  }
                />
              </span>
              <p
                style={{ borderColor: "lightgreen" }}
                className={privateRoom ? "public-off" : "public-off true"}>
                Private
              </p>
            </div>
            {privateRoom && (
              <>
                <div className={"private-wrapper"}>
                  <slot>
                    <h3>
                      <span id={"logo-style-inline"}>Chatty Chatter </span>
                      <br></br>
                      Private Chat
                    </h3>
                    <p>
                      Private rooms are Locked to the public by a custom key.
                    </p>
                  </slot>
                  <div className={"private-room-inputs"}>
                    <label htmlFor={"name"}>
                      {" "}
                      Room Name:
                      <input
                        type="text"
                        id="name"
                        onChange={(e) => setRoomName(e.target.value)}
                        value={roomName}
                      />
                    </label>
                    <div className={"private-room-inputs"}>
                      <label htmlFor={"room-password"}>
                        Create Key:
                        <input
                          type={isPasswordVisible ? "text" : "password"}
                          id={"room-password"}
                          value={
                            isPasswordVisible
                              ? password
                              : "•".repeat(password.length)
                          }
                          onChange={handleInputChange}
                          onKeyDown={() => handleKeyPress}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </>
            )}
            {!privateRoom && (
              <>
                {room === "0" && (
                  <div>
                    <label id="room-lookup">
                      Search for available room
                      <div id={"search-glass-wrapper"}>
                        <input
                          type="number"
                          value={searchValue}
                          onChange={(e) => setSearchValue(e.target.value)}
                          placeholder="Public number search(#)"
                        />
                        <button
                          type="button"
                          id={"search-for-avail-room-button"}
                          onClick={() => handleRoomAvailability(searchValue)}>
                          <img
                            src={searchGlass}
                            alt={"look-up-icon"}
                            width={"23"}
                          />
                        </button>
                      </div>
                    </label>
                  </div>
                )}
                {room !== "0" && (
                  <div>
                    <h3>
                      <span id={"logo-style-inline"}>Chatty Chatter </span>
                      <br></br>
                      Community Chat
                    </h3>
                    <slot className="content-container">
                      <p>
                        Congrats!
                        <br></br>
                        <br></br>
                        Room <span style={{ color: "yellow" }}>{room}</span> is
                        <span
                          style={{ color: "lightgreen", fontWeight: "800" }}>
                          {" "}
                          Available!
                        </span>
                        <br></br>
                        Create a free public Chat Hub below!
                        <br></br>
                        <br></br>
                        Toggle to create a private room.
                      </p>
                    </slot>

                    <div className="category-container">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}>
                        <img
                          id={"img-flip"}
                          src={dropdown}
                          alt={"dropdown-icon"}
                        />{" "}
                        <label htmlFor="category-list">Category</label>{" "}
                        <img src={dropdown} alt={"dropdown-icon"} />
                      </div>
                      <select
                        name="Category"
                        id="category-list"
                        onChange={(e) => setCategory(e.target.value)}>
                        <option value="">--Please choose an option--</option>
                        {categoryKeys.map((key, id) => {
                          const keyValue = CategoryOptions[key];
                          return (
                            <option key={id} value={keyValue}>
                              {keyValue}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                )}
                {categoryKeys !== "" &&
                  !privateRoom &&
                  room !== "0" &&
                  category && (
                    <div className="info-div">
                      <h4>
                        <span style={{ color: "#BBDEFB" }}>
                          * Following information <br></br>{" "}
                          <em>will be public.*</em>
                        </span>{" "}
                      </h4>
                      <div className={"private-info"}>
                        <div id={"number-value"}>
                          <label htmlFor={"public-number"}>room </label>
                          <input
                            type="number"
                            id={"public-number"}
                            placeholder={"#" + room}
                            readOnly
                          />
                        </div>
                        <br></br>
                        <div id={"name-value"}>
                          <label htmlFor={"public-name"}>Created By </label>

                          <input
                            type="name"
                            id={"public-name"}
                            placeholder={"@" + userLoginInfo.username}
                            readOnly
                          />
                        </div>
                        <div className={"category-result"}>
                          <label htmlFor={"public-name"}>Category</label>

                          <input
                            type="text"
                            id={"public-category"}
                            placeholder={category}
                            readOnly
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        className={"submit-button"}
                        onClick={() => handlePublicSubmit}>
                        Create
                      </button>
                    </div>
                  )}
              </>
            )}
          </div>
        </div>
      </form>
    </>
  );
};
export default CreateRoom;
