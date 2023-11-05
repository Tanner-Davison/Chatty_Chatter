import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GroupIcon from "@mui/icons-material/Group";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { Tilt } from "react-tilt";
import styles from "./RoomsCreated.module.css";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";

const RoomHelper = ({
  room,
  roomClass,
  changeRooms,
  imageURL,
  filterRooms,
  goToRoom,
}) => {
  const [displayAllUsers, SetDisplayAllUsers] = useState(false);
  const navigate = useNavigate();
  const defaultOptions = {
    reverse: true, // reverse the tilt direction
    max: 25, // max tilt rotation (degrees)
    perspective: 1000, // Transform perspective, the lower the more extreme the tilt gets.
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
    setAnchorEl(event.currentTarget);
  };
  console.log(room);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleRemoveRoom = (roomToRemove) => {
    handleClose();
    return filterRooms((prev) => prev.filter((room) => room !== roomToRemove));
  };
  return (
    <Tilt key={room._id} options={defaultOptions}>
      <div
        className={roomClass}
        room={room}
        // onClick={() => handleClick(room.room)}
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
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}>
            <MenuItem
              onClick={() => {
                handleClose();
                navigate(`/profile/${room.created_by}`);
              }}>
              Creators Profile
            </MenuItem>
            {!room.private_room && (
              <MenuItem
                onClick={() => {
                  handleClose();
                  return goToRoom(room.room_number);
                }}>
                Visit Room
              </MenuItem>
            )}
            {room.private_room && (
              <MenuItem
                onClick={() => {
                  handleClose();
                  return goToRoom(room.room_number);
                }}>
                Request invite
              </MenuItem>
            )}
            <MenuItem onClick={() => {
            handleRemoveRoom(room)
            changeRooms("left")}}>
              Hide Room
            </MenuItem>
          </Menu>
        </div>

        <GroupIcon
          className={styles.display_joined_list}
          onClick={() => SetDisplayAllUsers(!displayAllUsers)}
        />
        {!displayAllUsers && <p id={styles.room_members}>{room.room_name}</p>}
        {displayAllUsers && (
          <p id={styles.room_members}>
            {room.users_in_room.length + ` members`}
          </p>
        )}
      </div>
    </Tilt>
  );
};
export default RoomHelper;
