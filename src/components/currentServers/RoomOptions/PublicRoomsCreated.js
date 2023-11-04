import { useContext, useState, useEffect } from "react";
import { LoginContext } from "../../contexts/LoginContext";
import styles from "./RoomsCreated.module.css";
import KeyboardDoubleArrowRightTwoToneIcon from "@mui/icons-material/KeyboardDoubleArrowRightTwoTone";
import KeyboardDoubleArrowLeftTwoToneIcon from "@mui/icons-material/KeyboardDoubleArrowLeftTwoTone";
import { Tilt } from "react-tilt";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import CompressIcon from "@mui/icons-material/Compress";
import Tooltip from "@mui/material/Tooltip";
const PublicRoomsCreated = ({ roomsCreated, handleClick }) => {
  const publicMadeRooms = roomsCreated.filter((item) => item.private === false);

  const { userLoginInfo } = useContext(LoginContext);
  const [gridView, setGridView] = useState(false);
  const [roomsPerPage, setRoomsPerPage] = useState(4);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToAnimateOut, setItemsToAnimateOut] = useState(new Set());
  const [itemsToAnimateIn, setItemsToAnimateIn] = useState(new Set());
  const defaultOptions = {
    reverse: true, // reverse the tilt direction
    max: 25, // max tilt rotation (degrees)
    perspective: 209, // Transform perspective, the lower the more extreme the tilt gets.
    scale: 1.1, // 2 = 200%, 1.5 = 150%, etc..
    speed: 800, // Speed of the enter/exit transition
    transition: true, // Set a transition on enter/exit.
    axis: null, // What axis should be disabled. Can be X or Y.
    reset: true, // If the tilt effect has to be reset on exit.
    easing: "ease-out", // Easing on enter/exit.
  };

  const endIndex = Math.min(
    currentIndex + roomsPerPage,
    publicMadeRooms.length
  );

  const changeRooms = (direction) => {
    setItemsToAnimateOut(new Set(displayedRooms.map((room) => room.id)));
    setTimeout(() => {
      setItemsToAnimateOut(new Set());
      setCurrentIndex((prevIndex) => {
        if (direction === "left") {
          const newIndex = prevIndex - roomsPerPage;
          return newIndex < 0
            ? publicMadeRooms.length - roomsPerPage
            : newIndex;
        } else {
          const newIndex = prevIndex + roomsPerPage;
          return newIndex >= publicMadeRooms.length ? 0 : newIndex;
        }
      });
    }, 600); // match CSS sliding out
  };
  const changePages = (e) => {
    e.preventDefault();
    if (roomsPerPage === 4) {
      // Switching to full view
      setRoomsPerPage(publicMadeRooms.length);
      setGridView(true);
      setCurrentIndex(0); // Set the currentIndex to the start
    } else {
      // Switching back to limited view
      setRoomsPerPage(4);
      setGridView(false);
    }
  };
  useEffect(() => {
    const newItems = new Set(
      publicMadeRooms
        .slice(currentIndex, currentIndex + roomsPerPage)
        .map((room) => room.id)
    );
    setItemsToAnimateIn(newItems);

    const timer = setTimeout(() => {
      setItemsToAnimateIn(new Set());
    }, 800); // match css animation sliding in

    return () => clearTimeout(timer);
    //eslint-disable-next-line
  }, [currentIndex, roomsPerPage]);

  const displayedRooms = publicMadeRooms.slice(
    currentIndex,
    currentIndex + roomsPerPage
  );

  return (
    <>
      <div className={styles.rooms_wrapper}>
        <div className={styles.flex}>
          <div className={styles.room_info}>
            <span id={styles.display_created_room_name}>Owned public Hubs</span>
          </div>
          <div
            className={
              !gridView ? styles.room_item_wrapper : styles.grid_view_wrapper
            }>
             {gridView && (
              <Tooltip title="View less" placement="left">
                <CompressIcon
                  id={styles.grid_view_icon}
                  onClick={(e)=>changePages(e)}
                />
              </Tooltip>
            )}
            {!gridView && (
              <Tooltip title="View all" placement="left">
                <GridViewRoundedIcon
                  id={styles.grid_view_icon}
                  onClick={(e)=>changePages(e)}
                />
              </Tooltip>
            )}
            {displayedRooms.map((room) => {
              const isAnimatingOut = itemsToAnimateOut.has(room.id);
              const isAnimatingIn = itemsToAnimateIn.has(room.id);
              const roomClass = `${styles.room_item} ${
                isAnimatingOut
                  ? styles.slideOut
                  : isAnimatingIn
                  ? styles.slideIn
                  : ""
              } ${room.private ? styles.room_private : ""}`;

              return (
                <Tilt key={room._id} options={defaultOptions}>
                  <div
                    className={roomClass}
                    onClick={() => handleClick(room.room)}
                    value={room.room}>
                    <img
                      id={styles.room_owned_by_img}
                      src={userLoginInfo.imageUrl}
                      alt="owner"
                      height={40}
                    />
                    <p>{room.roomName}</p>
                  </div>
                </Tilt>
              );
            })}
          </div>
          <div className={styles.flex_row}>
            {!gridView && (
              <>
                <KeyboardDoubleArrowLeftTwoToneIcon
                  id={styles.icon_left_right}
                  onClick={() => changeRooms("left")}
                />
                <span id={styles.room_count}>
                  {endIndex} of {publicMadeRooms.length}
                </span>
                <KeyboardDoubleArrowRightTwoToneIcon
                  id={styles.icon_left_right}
                  onClick={() => changeRooms("right")}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PublicRoomsCreated;
