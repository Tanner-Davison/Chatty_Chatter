import { useParams } from "react-router-dom";
import Header from "../Header/Header";
import { useEffect, useState } from "react";
import { LoadProfileRoom } from "./LoadProfileRoom";
import "./Profile.css";
import SwitchOn from "./svgs/SwitchOn.svg";
import SwitchOff from "./svgs/SwitchOff.svg";
function Profile() {
  const [switchToggle, setSwitchToggle] = useState(false);
  const [userDataExists, setUserDataExists] = useState(false);
  const { username } = useParams();
  const [userInfo, setUserInfo] = useState({
    username: "",
    profile_pic: "",
  });

  const getData = async (username) => {
    const data = await LoadProfileRoom(username);
    const userData = await data;
    if (userData) {
      setUserDataExists(true);
      console.log(userData.profilePic);
      setUserInfo({
        username: userData.username,
        profile_pic: userData.profilePic,
      });
    } else {
      console.log("no data");
      setUserDataExists(false);
      return;
    }
  };

  useEffect(() => {
    !userDataExists ? getData(username) : console.log(userInfo);
    // eslint-disable-next-line
  }, []);
  return (
    <>
      <Header />
      <div className={"profile-main-container"}>
        {!userDataExists && <div>Loading ...</div>}
        <div className={"profile-content"}>
          <div className={"wrapper"}>
            <div class={switchToggle ? `gradient-border` : `regular-border`}>
              <img
                id={"profile-pic"}
                src={userInfo.profile_pic.url}
                alt={"profile_pic"}
                loading="lazy"
              />
            </div>
          </div>
          <div id={'username-switch-wrapper'}>
            <h2>@{userInfo.username.toUpperCase()}</h2>
            <img
              src={!switchToggle ? SwitchOn : SwitchOff}
              onClick={() => setSwitchToggle(!switchToggle)}
              id={"button-svg-toggle"}
              alt="Description"
            />
          </div>
        </div>

        <div>
          <p>Hello</p>
        </div>
        <div>
          <p>Hello</p>
        </div>
        <div>
          <p>Hello</p>
        </div>
      </div>
    </>
  );
}
export default Profile;
