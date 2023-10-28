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

const CreateRoom = (props) => {
  const { userLoginInfo } = useContext(LoginContext);
  const [roomPassword, setRoomPassword] = useState("");
  const [privateRoom, setPrivateRoom] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [roomName, setRoomName] = useState("");
  const categoryKeys = Object.keys(CategoryOptions);
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [category, setCategory] = useState("");
  const navigate = useNavigate();
  let { room } = useParams();

  const handlePublicSubmit = () => {
    //do something
  };
  const handleInputChange = (event) => {
    setPassword(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      // Prevent the form from submitting (if inside a form)
      event.preventDefault();
      // Toggle the visibility of the password
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
                  <content>
                    <p>
                      Private rooms are Locked to the public by a custom key.
                    </p>
                  </content>
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
                        Room Key:
                        <input
                          type={isPasswordVisible ? "text" : "password"}
                          id={"room-password"}
                          value={
                            isPasswordVisible
                              ? password
                              : "•".repeat(password.length)
                          }
                          onChange={handleInputChange}
                          keyPress={handleKeyPress}
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
                      Search Available Room:
                      <input
                        type="number"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                      />
                    </label>
                  </div>
                )}
                {room !== "0" && (
                  <div>
                    <content>
                      <h4>
                        Congrats! Room{" "}
                        <span style={{ color: "skyblue" }}>{room}</span> is
                        <span
                          style={{ color: "lightgreen", fontWeight: "800" }}>
                          {" "}
                          Available!
                        </span>
                        <br></br> Create a free public room!<br></br>
                        or toggle the switch to private.
                      </h4>
                    </content>
                    <label for="cetegory-list">Category:</label>

                    <select
                      name="Category"
                      id="category-list"
                      onChange={(e) => setCategory(e.target.value)}>
                      <option value="">--Please choose an option--</option>
                      {categoryKeys.map((cat) => {
                        return <option value={cat}>{cat}</option>;
                      })}
                    </select>
                  </div>
                )}
                {categoryKeys !== "" && !privateRoom && (
                  <div>
                    <h3>
                      The following information <br></br>{" "}
                      <span style={{ color: "red" }}>
                        {" "}
                        <em>will be</em>
                      </span>{" "}
                      shared with the public.
                    </h3>
                    <div className={"private-info"}>
                      <div id={"number-value"}>
                        <label htmlFor={"public-number"}>room # </label>
                        <input
                          type="number"
                          id={"public-number"}
                          placeholder={room}
                          readOnly
                        />
                      </div>
					  <br></br>
                      <div id={"name-value"}>
                        <label htmlFor={"public-name"}>Created By @ </label>

                        <input
                          type="name"
                          id={"public-name"}
                          placeholder={userLoginInfo.username}
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
