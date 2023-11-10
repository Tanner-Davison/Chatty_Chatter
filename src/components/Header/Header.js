import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState,useEffect,useContext, } from "react";
import { LoginContext } from "../contexts/LoginContext";
import "./Header.css";
import searchGlass from './svgs/searchGlass.svg'
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import AddCommentOutlinedIcon from "@mui/icons-material/AddCommentOutlined";
const Header = ({ joinRoom, roomChanger, room, handleMainButtonClick }) => {
  const usernameLocal = JSON.parse(sessionStorage.getItem("username"));
  const currentLocation = window.location.href.toString();
  const [visible, setVisible] = useState(true);
  const [menuOpen, setMenuOpen]=useState(true)
  const location = useLocation();
  const navigate = useNavigate();
  const { mainAccess, setMainAccess,userLoginInfo } =
    useContext(LoginContext);

  const headerClickHandler = () =>{
    setMainAccess(true);
    joinRoom();
  }
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
       //eslint-disable-next-line
    },[room])
  
  const getLinkStyle = (path) => {
    if (path.includes('/createroom') && location.pathname.includes('/createroom')) {
      return 'linkActive'
    }
    return path === location.pathname ? "linkActive" : "linkInactive";
  };
  useEffect(()=>{
    if(location.pathname.includes('/currentservers')){
      setMenuOpen(true)
    }else if(location.pathname.includes('/chatroom')){
      setMenuOpen(false)
    }
    //eslint-disable-next-line
  },[])
  return (
    <div
      className={
        currentLocation === "http://localhost:3000/"
          ? "headerContainer home"
          : "headerContainer other"
      }>
      <div className={"logo-wrapper"}>
        <div className={"logo_and_menu_button_wrapper"}>
          <h1 className={"logo-font"}>Chatty Chatter</h1>
          <button
            className={"menu_header_wrapper"}
            onClick={() => setMenuOpen(!menuOpen)}>
            <MenuRoundedIcon />
          </button>
        </div>
        {menuOpen && (
          <ul className={"navLinks"}>
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
                    <h2 className={getLinkStyle("/currentservers")}>
                      Chat-Hubs
                    </h2>
                  </Link>
                </li>
                <br></br>
                <span id={"span-id"} style={{ color: "white" }}>
                  |
                </span>
                <li>
                    <Link to={`/createroom/${0}`}>
                      <h2 className={getLinkStyle(`/createroom/${Number}`)}>
                        Add-Hub 
                  <AddCommentOutlinedIcon className={"add-hub-icon"}/>
                 
                      </h2>
                    </Link>
                </li>
                <br></br>
                <span id={"span-id"} style={{ color: "white" }}>
                  |
                </span>
              </>
            )}
          </ul>
        )}
      </div>
      {usernameLocal && currentLocation.includes("chatroom") && !menuOpen && (
        <div className={"create_room_container"}>
          <h2 style={{ color: "white", textWrap: "nowrap" }}>Hub Finder</h2>
          <input
            type="number"
            className={"roomInput"}
            placeholder="Room #"
            onKeyDown={handleKeyDown}
            onChange={roomChanger}
          />
          <button
            className={"buttonHeader"}
            type="button"
            onClick={headerClickHandler}>
            <img src={searchGlass} alt={"search hub"} />
            Search
          </button>
        </div>
      )}
      {usernameLocal && (
        <div className={"logout_wrapper"}>
          <div id={"logout-bottom-container"}>
            <Link to={`/profile/${usernameLocal}`}>
              <img
                src={userLoginInfo.imageUrl}
                alt={"header-profile-pic"}
                className={"header_profile_pic"}></img>
            </Link>
            <button
              type="button"
              id={"logout_button"}
              onClick={() => logoutHandler()}>
              Logout
            </button>
          </div>
        </div>
      )}
      {/* {visible && usernameLocal && !currentLocation.includes("chatroom") && (
        <div className={"visible_login_success"}>
          <p id="loggedIn">Logged in as: </p>
          <p style={{ color: "white" }}>{"@" + usernameLocal}</p>
        </div>
      )} */}
    </div>
  );
};

export default Header;
