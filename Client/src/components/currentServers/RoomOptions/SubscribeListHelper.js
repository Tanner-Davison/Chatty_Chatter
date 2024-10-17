import { useEffect, useState, useContext } from "react";
import { LoginContext } from "../../contexts/LoginContext.js";
import GroupIcon from "@mui/icons-material/Group";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { Tilt } from "react-tilt";
import axios from "axios";
import styles from "./RoomsCreated.module.css";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import useJoinedList from "../../Utility-mainRoom/useJoinedList.js";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
const SubscribeListHelper = ({
  room,
  roomClass,
  changeRooms,
  imageURL,
  filterRooms,
  handleRoomButtonClick,
  roomData,
  roomName,

  setCurrentIndex,
  pin,
}) => {
  const { error, setJoinedListResponse, removeRoom } = useJoinedList();
  const { userLoginInfo } = useContext(LoginContext);
  const [roomLength, setRoomLength] = useState("");
  const [displayAllUsers, SetDisplayAllUsers] = useState(false);
const PORT = process.env.REACT_APP_API_URL || 5000;
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
  const handleUnsubscribe = async (event) => {
    console.log(roomData);
    event.stopPropagation();
    const removeFromList = await removeRoom(
      userLoginInfo.username,
      room.room,
      roomName
    );
    if (removeFromList) {
      setJoinedListResponse(removeFromList);
      console.log(roomData, "hereee");
      filterRooms((prev) => prev.filter((room) => room.roomName !== roomName));
      setCurrentIndex(0);

      handleClose(event);
    }
    if (error) {
      console.error(error);
    }
  };
  const getRoomData = async () => {
    const roomToSend = [995664];
    try {
      const response = await axios.get(`/get_all_rooms`, {
        params: { rooms: roomToSend },
      });
      if (response.data) {
        console.log(response.data);
        const roomData = response.data;
        const filteredRoom = roomData.filter(
          (rooms) => rooms.room_number === room.room
        );
        if (filteredRoom) {
          console.log(filteredRoom);
          const singleRoom = filteredRoom[0];
          setRoomLength(singleRoom.users_in_room.length);
          return;
        }
        return console.log("no data");
      }
    } catch (error) {
      // Handle any errors that occur during the request
      console.error(error);
    }
  };
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
    handleClose(event);
    await filterRooms((prev) =>
      prev.filter((room) => room.room !== roomToRemove)
    );

    return;
  };

  const seeAllMembers = (event) => {
    event.stopPropagation();
    return SetDisplayAllUsers(!displayAllUsers);
  };

  useEffect(() => {
    getRoomData();
    //eslint-disable-next-line
  }, []);

  return (
    <Tilt options={defaultOptions}>
      <div
        key={room._id}
        className={roomClass}
        room={room}
        onClick={() => handleRoomButtonClick(room.room)}
        value={room.room}>
        <div className={styles.check_mark}>
          <CheckCircleOutlineOutlinedIcon
            id={styles.checked}
            src={imageURL}
            alt="owner"
            height={40}
          />
        </div>

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
            {!room.private_room && (
              <MenuItem onClick={() => handleRoomButtonClick(room.room)}>
                Visit Room
              </MenuItem>
            )}

            <MenuItem onClick={(event) => handleUnsubscribe(event)}>
              Unsubscribe
            </MenuItem>

            <MenuItem onClick={(event) => handleRemoveRoom(event, room.room)}>
              Hide Room
            </MenuItem>
          </Menu>
        </div>

        <GroupIcon
          className={styles.display_joined_list}
          onClick={(event) => seeAllMembers(event)}
        />
        {!displayAllUsers && (
          <p className={styles.room_members}>{room.roomName}</p>
        )}

        {displayAllUsers && (
          <p className={`${styles.room_members} ${styles._active}`}>
            {roomLength}
            <br></br>
            {roomLength === 1 ? "User" : "Users"}
          </p>
        )}
      </div>
    </Tilt>
  );
};
export default SubscribeListHelper;
