import { useContext, useState, useEffect } from "react";
import { LoginContext } from "../../contexts/LoginContext";
import styles from "./RoomsCreated.module.css";
import KeyboardDoubleArrowRightTwoToneIcon from "@mui/icons-material/KeyboardDoubleArrowRightTwoTone";
import KeyboardDoubleArrowLeftTwoToneIcon from "@mui/icons-material/KeyboardDoubleArrowLeftTwoTone";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import CompressIcon from "@mui/icons-material/Compress";
import Tooltip from "@mui/material/Tooltip";
import RoomHelper from "./RoomHelper";
import { getAllRoomsData } from "../AllRoomsJoined.js";

const PublicRoomsCreated = ({ roomsCreated, handleClick, allRoomsData }) => {
  const { userLoginInfo } = useContext(LoginContext);
  const [gridView, setGridView] = useState(false);
  const [roomsPerPage, setRoomsPerPage] = useState(4);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToAnimateOut, setItemsToAnimateOut] = useState(new Set());
  const [itemsToAnimateIn, setItemsToAnimateIn] = useState(new Set());
  const [privateMadeRooms, setPrivateMadeRooms] = useState([]);
  const [noData, setNoData] = useState(false);

  const endIndex = Math.min(
    currentIndex + roomsPerPage,
    privateMadeRooms.length
  );

  const changeRooms = (direction) => {
    setItemsToAnimateOut(new Set(displayedRooms.map((room) => room.id)));
    setTimeout(() => {
      setItemsToAnimateOut(new Set());
      setCurrentIndex((prevIndex) => {
          const newIndex = prevIndex + roomsPerPage;
          return newIndex >= privateMadeRooms.length ? 0 : newIndex;
       
      });
    }, 700); // match CSS sliding out
  };
   const changePages = async (e) => {
     e.preventDefault();
     if (roomsPerPage === 4) {
       // Switching to full view
       setRoomsPerPage(privateMadeRooms.length);
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
      privateMadeRooms
        .slice(currentIndex, currentIndex + roomsPerPage)
        .map((room) => room.id)
    );
    setItemsToAnimateIn(newItems);

  
    //eslint-disable-next-line
  }, [currentIndex, privateMadeRooms, roomsPerPage]);

  useEffect(() => {
    setPrivateMadeRooms(roomsCreated.filter((room)=>room.private !== false))
  }, [roomsCreated]);

  const displayedRooms = privateMadeRooms.slice(
    currentIndex,
    currentIndex + roomsPerPage
  );
  useEffect(() => {
    if (privateMadeRooms.length === 4) {
      console.log("this is running");
      setCurrentIndex(0);
    }
  }, [privateMadeRooms]);
  return (
    <>
      <div className={styles.rooms_wrapper}>
        <div className={styles.flex}>
          <div className={styles.room_info}>
            <span id={styles.display_created_room_name}>Your Private Hubs</span>
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
              } ${ styles.room_private }`;

              return (
                <div key={room._id}>
                  <RoomHelper
                    loading={"lazy"}
                    room={room}
                    roomClass={roomClass}
                    imageURL={userLoginInfo.imageUrl}
                    allRooms={roomsCreated}
                    filterRooms={setPrivateMadeRooms}
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
                  {Math.ceil(endIndex/4)} / {Math.ceil(privateMadeRooms.length/4)}
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
