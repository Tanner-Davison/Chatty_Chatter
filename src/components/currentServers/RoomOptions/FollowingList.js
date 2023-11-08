import { useContext, useState, useEffect } from "react";
import { LoginContext } from "../../contexts/LoginContext";
import styles from "./RoomsCreated.module.css";
import KeyboardDoubleArrowRightTwoToneIcon from "@mui/icons-material/KeyboardDoubleArrowRightTwoTone";
import KeyboardDoubleArrowLeftTwoToneIcon from "@mui/icons-material/KeyboardDoubleArrowLeftTwoTone";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import CompressIcon from "@mui/icons-material/Compress";
import Tooltip from "@mui/material/Tooltip";
import RoomHelper from "./RoomHelper";
import { AllRoomsJoined } from "../AllRoomsJoined.js";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

const FollowingList = ({ roomsCreated, handleClick }) => {
  const { userLoginInfo } = useContext(LoginContext);
  const [gridView, setGridView] = useState(false);
  const [roomsPerPage, setRoomsPerPage] = useState(4);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToAnimateOut, setItemsToAnimateOut] = useState(new Set());
  const [itemsToAnimateIn, setItemsToAnimateIn] = useState(new Set());
  const [publicMadeRooms, setPublicMadeRooms] = useState([]);
  const [noData, setNoData] = useState(false);

  const endIndex = Math.min(
    currentIndex + roomsPerPage,
    publicMadeRooms.length
  );

  const changeRooms = (direction) => {
    setItemsToAnimateOut(new Set(displayedRooms.map((room) => room.id)));
    setTimeout(() => {
      setItemsToAnimateOut(new Set());
      setCurrentIndex((prevIndex) => {
        const newIndex = prevIndex + roomsPerPage;
        return newIndex >= publicMadeRooms.length ? 0 : newIndex;
      });
    }, 600); // match CSS sliding out
  };
  const changePages = async (e) => {
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
  }, [currentIndex, publicMadeRooms, itemsToAnimateOut]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const roomData = await AllRoomsJoined(userLoginInfo.username);
        if (roomData.roomsJoined.length <= 0) {
          setNoData(true);
        }
        const roomValue = roomData.roomsJoined.filter(
          (room) => !room.private_room
        );
        setPublicMadeRooms(roomValue);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
    //eslint-disable-next-line
  }, [userLoginInfo.username, noData]);

  const displayedRooms = publicMadeRooms.slice(
    currentIndex,
    currentIndex + roomsPerPage
  );
  return (
    <>
      <div className={styles.rooms_wrapper}>
        <div className={styles.flex}>
          <div className={styles.room_info}>
            <span id={styles.display_created_room_name}>
              Created Public Hubs
            </span>
          </div>
          <div
            className={
              !gridView ? styles.room_item_wrapper : styles.grid_view_wrapper
            }>
            {gridView && (
              <Tooltip title="View less" placement="left">
                <CompressIcon
                  id={styles.grid_view_icon}
                  onClick={(e) => changePages(e)}
                />
              </Tooltip>
            )}
            {!gridView && (
              <Tooltip title="View all" placement="left">
                <GridViewRoundedIcon
                  id={styles.grid_view_icon}
                  onClick={(e) => changePages(e)}
                />
              </Tooltip>
            )}
            {noData && (
              <p style={{ textAlign: "center" }}>
                Create a public hub to view this section
              </p>
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
                <div key={room._id}>
                  <RoomHelper
                    key={room._id}
                    loading={"lazy"}
                    room={room}
                    roomClass={roomClass}
                    imageURL={userLoginInfo.imageUrl}
                    filterRooms={setPublicMadeRooms}
                    changeRooms={changeRooms}
                    goToRoom={handleClick}
                    roomData={setPublicMadeRooms}
                  />
                </div>
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

export default FollowingList;
