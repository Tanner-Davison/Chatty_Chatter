import { useContext, useState, useEffect } from "react";
import { LoginContext } from "../../contexts/LoginContext.js";
import styles from "./RoomsCreated.module.css";
import KeyboardDoubleArrowRightTwoToneIcon from "@mui/icons-material/KeyboardDoubleArrowRightTwoTone";
import KeyboardDoubleArrowLeftTwoToneIcon from "@mui/icons-material/KeyboardDoubleArrowLeftTwoTone";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import CompressIcon from "@mui/icons-material/Compress";
import Tooltip from "@mui/material/Tooltip";
import SubscribeListHelper from "./SubscribeListHelper.js";
import { getAllRoomsData } from "../AllRoomsJoined.js";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import pin from './assets/pin.png'
const SubscribedList = ({ roomsJoined, handleRoomButtonClick }) => {
  const { userLoginInfo } = useContext(LoginContext);
  const [gridView, setGridView] = useState(false);
  const [roomsPerPage, setRoomsPerPage] = useState(4);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToAnimateOut, setItemsToAnimateOut] = useState(new Set());
  const [itemsToAnimateIn, setItemsToAnimateIn] = useState(new Set());
  const [subscribedRooms, setSubscribedRooms] = useState([]);
  const [noData, setNoData] = useState(false);

  const endIndex = Math.min(
    currentIndex + roomsPerPage,
    subscribedRooms.length
  );

  const changeRooms = () => {
    setItemsToAnimateOut(new Set(displayedRooms.map((room) => room.id)));
    setTimeout(() => {
      setItemsToAnimateOut(new Set());
      setCurrentIndex((prevIndex) => {
        const newIndex = prevIndex + roomsPerPage;
        return newIndex >= subscribedRooms.length ? 0 : newIndex;
      });
    }, 600); // match CSS sliding out
  };
  useEffect(() => {
    const newItems = new Set(
      subscribedRooms
        .slice(currentIndex, currentIndex + roomsPerPage)
        .map((room) => room.id)
    );
    setItemsToAnimateIn(newItems);

    const timer = setTimeout(() => {
      setItemsToAnimateIn(new Set());
    }, 800); // match css animation sliding in

    return () => clearTimeout(timer);
    //eslint-disable-next-line
  }, [currentIndex, subscribedRooms, roomsPerPage]);

  useEffect(() => {
    setSubscribedRooms(roomsJoined);
  }, [roomsJoined]);

  useEffect(() => {
    if (subscribedRooms.length <= 4) {
      console.log("this is running");
      setCurrentIndex(0);
    } else if (subscribedRooms.length === 0 || null) {
      setNoData(true);
    } else {
      setNoData(false);
    }
  }, [subscribedRooms]);
  const displayedRooms = subscribedRooms.slice(
    currentIndex,
    currentIndex + roomsPerPage
  );
  return (
    <>
      <div className={styles.rooms_wrapper}>
        
        <div className={styles.flex}>
          <div className={styles.room_info}>
            <span id={styles.display_created_room_name}>Subscribed Hubs </span>
          </div>
          <div
            className={
              !gridView ? styles.room_item_wrapper : styles.grid_view_wrapper
            }>
            {gridView && (
              <Tooltip title="View less" placement="left">
                <CompressIcon
                  id={styles.grid_view_icon}
                  onClick={() => {
                    setGridView((prev) => !prev);
                    if (roomsPerPage === 4) {
                      setCurrentIndex(0);
                      setRoomsPerPage(subscribedRooms.length);
                    } else {
                      setRoomsPerPage(4);
                    }
                  }}
                />
              </Tooltip>
            )}
            {!gridView && (
              <Tooltip title="View all" placement="left">
                <GridViewRoundedIcon
                  id={styles.grid_view_icon}
                  onClick={() => {
                    setGridView((prev) => !prev);
                    if (roomsPerPage === 4) {
                      setCurrentIndex(0);
                      setRoomsPerPage(subscribedRooms.length);
                    } else {
                      setRoomsPerPage(4);
                    }
                  }}
                />
              </Tooltip>
            )}
            {noData && (
              <p id={styles.no_data_info}>Subscribe to a hub to view it here</p>
            )}
            {displayedRooms.map((room) => {
              const isAnimatingOut = itemsToAnimateOut.has(room.id);
              const isAnimatingIn = itemsToAnimateIn.has(room.id);
              const roomClass = `${styles.room_item_subscribe} ${
                isAnimatingOut
                  ? styles.slideOut
                  : isAnimatingIn
                  ? styles.slideIn
                  : ""
              }`;

              return (
                <div key={room._id}>
                  <SubscribeListHelper
                    loading={"lazy"}
                    room={room}
                    roomClass={roomClass}
                    imageURL={userLoginInfo.imageUrl}
                    filterRooms={setSubscribedRooms}
                    changeRooms={changeRooms}
                    handleRoomButtonClick={handleRoomButtonClick}
                    roomData={subscribedRooms}
                    pin={pin}
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
                  {Math.ceil(endIndex / 4)} /{" "}
                  {Math.ceil(subscribedRooms.length / 4)}
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

export default SubscribedList;
