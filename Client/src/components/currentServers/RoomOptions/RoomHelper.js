import { useState} from "react";
import { useNavigate } from "react-router-dom";
import GroupIcon from "@mui/icons-material/Group";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { Tilt } from "react-tilt";
import styles from "./RoomsCreated.module.css";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import { TryDeleteOne } from "../AllRoomsJoined.js";
import useJoinedList from "../../Utility-mainRoom/useJoinedList.js";
const RoomHelper = ({
  room,
  roomClass,
  changePages,
  imageURL,
  filterRooms,
  setRoomsPerPage,
  goToRoom,
  roomData,
  allRoomsData,
  username,
}) => {
  const { removeRoom } = useJoinedList();
  const [displayAllUsers, SetDisplayAllUsers] = useState(false);
  const [usersInRoom, setUsersInroom] = useState("");
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
    easing: "none", // Easing on enter/exit.
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (event) => {
    event.stopPropagation();
    return setAnchorEl(null);
  };

  const handleRemoveRoom = async (event, roomToRemove) => {
    event.stopPropagation();
    await filterRooms((prev) =>
      prev.filter((room) => room.room !== roomToRemove)
    );

    handleClose(event);
    return;
  };

  const handleViewProfile = (event) => {
    event.stopPropagation();
    navigate(`/profile/${username}`);
    handleClose(event);
  };
  const seeAllMembers = async (event, roomParam) => {
    event.stopPropagation();

    
    const roomToMatch = allRoomsData.roomsCreatedByUser.find(
      (room) => room.room_number === roomParam
    );

    if (roomToMatch) {
      const numberOfUsers = roomToMatch.users_in_room.length;
     
      setUsersInroom(numberOfUsers); 
      SetDisplayAllUsers(!displayAllUsers);
    } else {
      
    }
  };

  const handleDeleteEvent = async (event, room_id, roomNumber) => {
    event.stopPropagation();
    handleClose(event);

    try {
      
      const deleteRoom = await TryDeleteOne(room_id, roomNumber);
      const response = await deleteRoom;
      if (response) {
        console.log("Room deletion response:", response);
      }

      
      removeRoom(username, roomNumber, roomData);

    
      filterRooms((prev) => prev.filter((room) => room._id !== room_id));
    } catch (error) {
      console.error("Error in handleDeleteEvent:", error);
    }
  };

  return (
    <Tilt key={room._id} options={defaultOptions}>
      <div
        className={roomClass}
        room={room}
        onClick={() => goToRoom(room.room)}
        value={room.room}>
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
            <Tooltip title="Hub Menu" placement="top">
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
            <MenuItem onClick={(event) => handleViewProfile(event)}>
              View Profile
            </MenuItem>
            {!room.private_room && (
              <MenuItem
                onClick={(e) => handleDeleteEvent(e, room._id, room.room)}>
                Delete
              </MenuItem>
            )}
            {room.private_room && (
              <MenuItem
                onClick={(event) =>
                  handleDeleteEvent(event, room.room, room.room_number)
                }>
                Delete
              </MenuItem>
            )}
            <MenuItem onClick={(event) => handleRemoveRoom(event, room.room)}>
              Hide Room
            </MenuItem>
          </Menu>
        </div>

        <GroupIcon
          className={styles.display_joined_list}
          onClick={(event) => seeAllMembers(event, room.room)}
        />
        {!displayAllUsers && (
          <p className={styles.room_members}>{room.roomName}</p>
        )}
        {displayAllUsers && (
          <div
            className={`${styles.parent_of_diplayed_room_members} ${styles._active}`}>
            <span id={styles.number_span}>{usersInRoom}</span>
            <p id={styles.child_of_room_members}>{usersInRoom === 1 ? `member`:'members'}</p>
          </div>
        )}
      </div>
    </Tilt>
  );
};
export default RoomHelper;
