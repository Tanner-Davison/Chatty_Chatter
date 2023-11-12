import { useParams, useNavigate,useLocation } from "react-router-dom";
import Header from "../Header/Header";
import { useEffect, useState, useContext } from "react";
import { LoginContext } from "../contexts/LoginContext";
import { LoadProfileRoom } from "./LoadProfileRoom";
import AboutMe from "./profilesections/AboutMe";
import styles from "./Profile.module.css";
import SwitchOn from "./svgs/SwitchOn.svg";
import SwitchOff from "./svgs/SwitchOff.svg";
import axios from "axios";
import DotsComp from "./profilesections/dotsComp";
import ProfilePage from "./profilesections/ProfilePage";
import Switch from "@mui/material/Switch";
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";
import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";
const Profile = () => {
  const { userLoginInfo } = useContext(LoginContext);
  const navigate = useNavigate();
  const [switchToggle, setSwitchToggle] = useState(false);
  const [userDataExists, setUserDataExists] = useState('');
  const [personalProfile, setPersonalProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profession, setProfession]=useState('')
  const [education, setEducation] = useState("");
  const [profileBio, setProfileBio] = useState("");
  const [allUserData, setAllUserData]=useState('')
  const { username } = useParams();
  const location = useLocation();
  const [customProfileData, setCustomProfileData] = useState(false);
  const PORT = process.env.REACT_APP_PORT;
  const [userInfo, setUserInfo] = useState({
    username: "",
    profile_pic: "",
  });

  const getData = async (username) => {
   
    const data = await LoadProfileRoom(username);
    const userData = data;
    if (userData) {
      if(!userData){
        return console.log('no user found in PROFILE Component');
        
      }
      if (!userData.profileBio) {
        setCustomProfileData(false);
      }else{
        setCustomProfileData(true)
        setAllUserData(userData)
      }
      setUserDataExists(true);
      console.log(userData.profilePic);
      setUserInfo({
        username: userData.username,
        profile_pic: userData.profilePic,
        userPageInfo: userData.profileContent,
      });
     
    } else {
      console.log("no data");
      setUserDataExists(false);
      return;
    }
  };
const label = { inputProps: { "aria-label": "Switch demo" } };
  const handleFormSubmit = async () => {
    const params = {
      profession,
      education,
      profileBio,
      username: userLoginInfo.username,
    };
    const response = await axios
      .post(`${PORT}/updateUserProfile`, params)
      .then((res) => {
        const {success} = res;
          if(success){
            getData();
            console.log('we did it!');
            setCustomProfileData(!customProfileData);
            setUserDataExists(true)
          }
      })
      .catch((err) => {
        console.log(err);
      });
  };
const editYourProfile =async(e)=>{
  e.preventDefault()
  console.log('customProfileData',customProfileData);
  console.log('switchToggle',switchToggle);
  console.log('isEditing',isEditing);

    setCustomProfileData(!customProfileData)
    setSwitchToggle(!switchToggle);
    setIsEditing(true)
}
  const closeEditYourProfile=()=>{
    setCustomProfileData((prev)=>!prev)
    setSwitchToggle(!switchToggle);
    setIsEditing(false);
    return;
  }
  useEffect(()=>{
    console.log("URL changed:", location.pathname);

    getData(username)

  },[location.pathname])
  useEffect(() => {
   
    if(isEditing){
      return;
    }
    if (userLoginInfo.username === username) {
      setPersonalProfile(true);
      !userDataExists ? getData(username) : console.log(userInfo);
    } else {
      setPersonalProfile(false);
      !userDataExists ? getData(username) : console.log(userInfo);
    }

    // eslint-disable-next-line
  }, [personalProfile, userLoginInfo.username,getData]);
  return (
    <>
      <Header />
      <div className={styles.profile_main_container}>
        {!userDataExists && <div>Loading ...</div>}
            <div className={styles.profile_wrapper_image_icon}>
        <div className={styles.profile_content}>
          <div className={"wrapper"}>
            <div
              className={
                
              `${styles.regular_border}`
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
              {personalProfile && !isEditing && (
                <>
                  <ModeEditOutlinedIcon
                    {...label}
                    checked={isEditing}
                    onClick={(e) => editYourProfile(e)}
                    id={styles.switchIcon}
                  />
                </>
              )}
              {personalProfile && isEditing && (
                <>
                  <DriveFileRenameOutlineOutlinedIcon
                    {...label}
                    checked={isEditing}
                    onClick={(e) => closeEditYourProfile(e)}
                    id={styles.switchIcon}
                  />
                </>
              )}

              {!personalProfile && (
                <Switch
                  src={!switchToggle ? SwitchOn : SwitchOff}
                  onClick={() => setSwitchToggle(!switchToggle)}
                  id={styles.switchIcon}
                  alt="Description"
                />
              )}
            </div>
          </div>
          {isEditing && personalProfile && (
            <DotsComp
              className={styles.is_editing_dots}
              typer={userLoginInfo.username}></DotsComp>
          )}
        </div>
        {personalProfile && !customProfileData && (
          <>
            <AboutMe
              setEducation={setEducation}
              setProfileBio={setProfileBio}
              setProfession={setProfession}
              handleFormSubmit={handleFormSubmit}
            />
          </>
        )}
      </div>
      {!isEditing && (
        <div className={styles.profile_main_container_body}>
          <div className={styles.aboutPerson}>
            <ProfilePage userData={allUserData} />
          </div>
        </div>
      )}
    </>
  );
};
export default Profile;
