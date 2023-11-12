import { useParams, useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import { useEffect, useState, useContext } from "react";
import { LoginContext } from "../contexts/LoginContext";
import { LoadProfileRoom } from "./LoadProfileRoom";
import AboutMe from "./profilesections/AboutMe";
import styles from "./Profile.module.css";
import SwitchOn from "./svgs/SwitchOn.svg";
import SwitchOff from "./svgs/SwitchOff.svg";

const Profile = () => {
  const { userLoginInfo } = useContext(LoginContext);
  const navigate = useNavigate();
  const [switchToggle, setSwitchToggle] = useState(false);
  const [userDataExists, setUserDataExists] = useState(false);
  const [personalProfile, setPersonalProfile] = useState(null);
  const [aboutMe, setAboutMe] =useState('')
  const [education, setEducation]=useState('')
  const [profileBio, setProfileBio]=useState('')
  const { username } = useParams();
  const [customProfileData, setCustomProfileData] = useState("");
  const [userInfo, setUserInfo] = useState({
    username: "",
    profile_pic: "",
  });

  const getData = async (username) => {
    const data = await LoadProfileRoom(username);
    const userData = await data;
    if (userData) {
      if (!userData.profilePublicData) {
        setCustomProfileData(null);
      }
      setUserDataExists(true);
      console.log(userData.profilePic);
      setUserInfo({
        username: userData.username,
        profile_pic: userData.profilePic,
        userPageInfo: userData.profileContent,
      });
      console.log(userData);
    } else {
      console.log("no data");
      setUserDataExists(false);
      return;
    }
  };
  useEffect(() => {
    getData(username);
  }, [navigate, username]);
  
  useEffect(() => {
    if (userLoginInfo.username === username) {
      setPersonalProfile(true);
      !userDataExists ? getData(username) : console.log(userInfo);
    } else {
      setPersonalProfile(false);
      !userDataExists ? getData(username) : console.log(userInfo);
    }

    // eslint-disable-next-line
  }, [personalProfile, userLoginInfo.username]);
  return (
    <>
      <Header />
      <div className={styles.profile_main_container}>
        {!userDataExists && <div>Loading ...</div>}
        <div className={styles.profile_content}>
          <div className={"wrapper"}>
            <div
              className={
                switchToggle
                  ? `${styles.gradient_border}`
                  : `${styles.regular_border}`
              }>
              <img
                id={styles.profile_pic}
                src={userInfo.profile_pic.url}
                alt={"profile_pic"}
                loading="lazy"
              />
            </div>
          </div>
          <div id={styles.username_switch_wrapper}>
            <h2>@{userInfo.username.toUpperCase()}</h2>
            <img
              src={!switchToggle ? SwitchOn : SwitchOff}
              onClick={() => setSwitchToggle(!switchToggle)}
              id={styles.button_svg_toggle}
              alt="Description"
            />
          </div>
        </div>
        {personalProfile && !customProfileData && (
          <>
            <AboutMe 
            setEducation={setEducation} 
            setProfileBio={setProfileBio}/>
          </>
        )}
      </div>
    </>
  );
};
export default Profile;
