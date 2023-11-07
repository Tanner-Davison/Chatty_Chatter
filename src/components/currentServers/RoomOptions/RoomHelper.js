import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GroupIcon from "@mui/icons-material/Group";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { Tilt } from "react-tilt";
import styles from "./RoomsCreated.module.css";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import {deleteOne} from '../AllRoomsJoined.js'
const RoomHelper = ({
  room,
  roomClass,
  changeRooms,
  imageURL,
  filterRooms,
  setRoomsPerPage,
  goToRoom,
  roomData,
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
    event.stopPropagation()
    return setAnchorEl(null);
  };
  const handleRemoveRoom = async (event, roomToRemove) => {
    event.stopPropagation();
    handleClose(event);
     await filterRooms((prev) => prev.filter((room) => room.room_number !== roomToRemove));
    changeRooms('left');
    return
  };
  const undo =(event)=>{
    event.stopPropagation();
  }
  const handlegoToRoom = (event, roomToVisit) => {
    
    return goToRoom(room.room_number);
  };
  const handleMenuOpen = (event) => {
    event.stopPropagation();
    handleClose(event);
    return navigate(`/profile/${room.created_by}`);
  };
  const seeAllMembers =(event)=>{
    event.stopPropagation();
    return SetDisplayAllUsers(!displayAllUsers);
  }
  const handleDeleteEvent= (event, room_id,roomNumber)=>{
    console.log(room_id)
    event.stopPropagation();
    event.preventDefault();
     handleClose(event);
      deleteOne(room_id, roomNumber);
      return roomData((prev)=> prev.filter((room)=> room._id!== room_id ))
  }

  return (
    <Tilt options={defaultOptions}>
      <div
        key={room._id}
        className={roomClass}
        room={room}
        onClick={() => goToRoom(room.room_number)}
        value={room.room_number}>
        <img
          id={styles.room_owned_by_img_expolore}
          src={imageURL}
          alt="owner"
          height={40}
        />

        <div className={styles.menu_wrapper}>
          <Button
            className={styles.menu_icon}
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}>
            <Tooltip title="Room Menu" placement="top">
              <MenuRoundedIcon id={styles.menu_icon} />
            </Tooltip>
          </Button>
          <Menu
            className={styles.dropdown_list}
            anchorEl={anchorEl}
            open={open}
            onClose={(event) => handleClose(event)}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}>
            <MenuItem onClick={(event) => handleMenuOpen(event)}>
              View Profile
            </MenuItem>
            {!room.private_room && (
              <MenuItem onClick={() => handlegoToRoom(room.room_number)}>
                Visit Room
              </MenuItem>
            )}
            {room.private_room && (
              <MenuItem
                onClick={(event) => handleDeleteEvent(event, room._id, room.room_number)
                }>
               Delete
              </MenuItem>
            )}
            <MenuItem onClick={(event) => handleRemoveRoom(event, room.room_number)}>
              Hide Room
            </MenuItem>
          </Menu>
        </div>

        <GroupIcon
          className={styles.display_joined_list}
          onClick={(event) => seeAllMembers(event)}
        />
        {!displayAllUsers && (
            <p className={styles.room_members}>{room.room_name}</p>
            )}
        {displayAllUsers && (
          <p className={`${styles.room_members} ${styles._active} `}>
          {room.users_in_room.length + ` members`}
          </p>
        )}
      </div>
    </Tilt>
  );
};
export default RoomHelper;
