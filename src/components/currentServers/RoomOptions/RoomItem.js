import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GroupIcon from "@mui/icons-material/Group";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { Tilt } from "react-tilt";
import styles from "./RoomsCreated.module.css";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import LockSharpIcon from "@mui/icons-material/LockSharp";
import Tooltip from "@mui/material/Tooltip";
const RoomItem = ({
  room,
  roomClass,
  changeRooms,
  allRooms,
  imageURL,
  filterRooms,
  goToRoom,
  setCurrentIndex,
}) => {
  const [displayAllUsers, SetDisplayAllUsers] = useState(false);
  const navigate = useNavigate();
  const defaultOptions = {
    reverse: true, // reverse the tilt direction
    max: 25, // max tilt rotation (degrees)
    perspective: 700, // Transform perspective, the lower the more extreme the tilt gets.
    scale: 1.1, // 2 = 200%, 1.5 = 150%, etc..
    speed: 800, // Speed of the enter/exit transition
    transition: true, // Set a transition on enter/exit.
    axis: null, // What axis should be disabled. Can be X or Y.
    reset: true, // If the tilt effect has to be reset on exit.
    easing: "ease-out", // Easing on enter/exit.
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event) => {
    event.stopPropagation();
    setAnchorEl(null);
  };
  const handleDisplayUsers = (event) => {
    event.stopPropagation();
    
    SetDisplayAllUsers(!displayAllUsers);
  
  };
  const handleRemoveRoom = async (event, roomToRemove) => {
    event.stopPropagation();
    handleClose(event);
    await filterRooms((prev) => prev.filter((room) => room !== roomToRemove));
    return;
  };
  const handleLockClick = (e) => {
    e.stopPropagation();
  };
  const handleGoToRoom = (event, roomNumber) => {
    event.stopPropagation();
    handleClose(event);
    goToRoom(roomNumber);
  };
  return (
    <Tilt key={room._id} options={defaultOptions}>
      <div
        className={roomClass}
        room={room}
        onClick={(e) => handleGoToRoom(e, room.room_number)}
        value={room.room}>
        <img
          id={styles.room_owned_by_img_expolore}
          src={imageURL}
          alt="owner"
          height={40}
        />
        <Tooltip title="Hub Menu" placement="top">
          <div className={styles.menu_wrapper}>
            <Button
              className={styles.menu_icon}
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={(e) => handleClick(e)}>
              <MenuRoundedIcon id={styles.menu_icon} />
            </Button>

            <Menu
              className={styles.dropdown_list}
              anchorEl={anchorEl}
              open={open}
              onClose={(e) => handleClose(e)}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}>
              <MenuItem
                onClick={(e) => {
                  handleClose(e);
                  navigate(`/profile/${room.created_by}`);
                }}>
                Admins Profile
              </MenuItem>
              {!room.private_room && (
                <MenuItem
                  onClick={(e) => {
                    handleGoToRoom(e, room.room_number);
                  }}>
                  Visit Room
                </MenuItem>
              )}
              {room.private_room && (
                <MenuItem
                  onClick={(e) => {
                    handleClose(e);
                    return goToRoom(room.room_number);
                  }}>
                  Request Access
                </MenuItem>
              )}
              <MenuItem onClick={(e) => handleRemoveRoom(e, room)}>
                Hide Room
              </MenuItem>
            </Menu>
          </div>
        </Tooltip>
        {room.private_room && (
          <>
            <LockSharpIcon className={styles.display_joined_list}>
              <Menu
                className={styles.dropdown_list}
                anchorEl={anchorEl}
                open={open}
                onClose={(e) => handleClose(e)}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}>
                <MenuItem
                  onClick={(e) => {
                    handleLockClick(e);
                  }}></MenuItem>
              </Menu>
            </LockSharpIcon>
          </>
        )}
        {!room.private_room && (
          <GroupIcon
            className={styles.display_joined_list}
            onClick={(e) => handleDisplayUsers(e)}
          />
        )}
        {!displayAllUsers && (
          <p className={styles.room_members}>{room.room_name}</p>
        )}

        {displayAllUsers && (
          <div
            className={`${styles.parent_of_diplayed_room_members} ${styles._active}`}>
            <span id={styles.number_span}>{room.users_in_room.length}</span>
            <p id={styles.child_of_room_members}>{` members`}</p>
          </div>
        )}
      </div>
    </Tilt>
  );
};
export default RoomItem;
