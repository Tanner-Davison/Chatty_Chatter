import { useContext, useState, useEffect } from "react";
import { LoginContext } from "../../contexts/LoginContext";
import styles from "./RoomsCreated.module.css";
import KeyboardDoubleArrowRightTwoToneIcon from "@mui/icons-material/KeyboardDoubleArrowRightTwoTone";
import KeyboardDoubleArrowLeftTwoToneIcon from "@mui/icons-material/KeyboardDoubleArrowLeftTwoTone";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import CompressIcon from "@mui/icons-material/Compress";
import Tooltip from "@mui/material/Tooltip";
import RoomHelper from "./RoomHelper";

const PublicRoomsCreated = ({ roomsCreated, handleClick, allRoomsData }) => {
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
      if(newIndex === 1){
        return 0
      }
      return newIndex >= publicMadeRooms.length ? 0 : newIndex;
    });
  }, 700); // match CSS sliding out
};
const changePages = async (e) => {
  e.preventDefault();
  if (roomsPerPage <= 4) {
    // Switching to full view
    setGridView((prev) => !prev);
   
    setCurrentIndex(0); // Set the currentIndex to the start
  } else {
    // Switching back to limited view
    setRoomsPerPage(4);
    setGridView(false);
  }
};
 const itemsToAnimate = (newItems) => {
    setItemsToAnimateIn(newItems);
 };
 
 useEffect(() => {
  const slicedRooms = publicMadeRooms.slice(currentIndex, currentIndex + roomsPerPage);

  const newItems = new Set(
    slicedRooms.length === 1
      ? [slicedRooms[0].id] // If there's only one item, use its id
      : slicedRooms.map((room) => room.id)
  );

  itemsToAnimate(newItems)


  //eslint-disable-next-line
}, [currentIndex, publicMadeRooms, roomsPerPage]);

  useEffect(() => {
    setPublicMadeRooms(roomsCreated.filter((room => room.private !== true )))
  }, [roomsCreated]);

  useEffect(()=> {
   if (publicMadeRooms.length === 4) {
     console.log("this is running");
     setCurrentIndex(0);
     setNoData(false)
   } else if (publicMadeRooms.length < 4 && publicMadeRooms >= 1) {
     setNoData(false);
   } else if (publicMadeRooms.length === 0 || null) {
     setNoData(true);
   } else {
     setNoData(false);
   }
  },[publicMadeRooms])
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
              Your Public Hubs
            </span>
          </div>
          <div
            className={
              !gridView ? styles.room_item_wrapper : styles.grid_view_wrapper
            }>
              {noData && (
                <p></p>
              )}
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
              <p id={styles.no_data_info}>
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
                    loading={"lazy"}
                    room={room}
                    roomClass={roomClass}
                    imageURL={userLoginInfo.imageUrl}
                    filterRooms={setPublicMadeRooms}
                    changePages={changePages}
                    goToRoom={handleClick}
                    roomData={room.roomName}
                    allRoomsData={allRoomsData}
                    username={userLoginInfo.username}
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
                  {Math.ceil(endIndex /4)} / {Math.ceil(publicMadeRooms.length /4)}
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
