import { useContext, useState, useEffect } from "react";
import { LoginContext } from "../../contexts/LoginContext";
import styles from "./RoomsCreated.module.css";
import KeyboardDoubleArrowRightTwoToneIcon from "@mui/icons-material/KeyboardDoubleArrowRightTwoTone";
import KeyboardDoubleArrowLeftTwoToneIcon from "@mui/icons-material/KeyboardDoubleArrowLeftTwoTone";

const RoomsCreated = ({ roomsCreated }) => {
  const { userLoginInfo } = useContext(LoginContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToAnimateOut, setItemsToAnimateOut] = useState(new Set());
  const [itemsToAnimateIn, setItemsToAnimateIn] = useState(new Set());
  const roomsPerPage = 4;

  const endIndex = Math.min(currentIndex + roomsPerPage, roomsCreated.length);

  const changeRooms = (direction) => {
    setItemsToAnimateOut(new Set(displayedRooms.map((room) => room.id)));

    // wait until animation finishes before sliding in the new items.
    setTimeout(() => {
      setItemsToAnimateOut(new Set());

      setCurrentIndex((prevIndex) => {
        if (direction === "left") {
          const newIndex = prevIndex - roomsPerPage;
          return newIndex < 0 ? roomsCreated.length - roomsPerPage : newIndex;
        } else {
          const newIndex = prevIndex + roomsPerPage;
          return newIndex >= roomsCreated.length ? 0 : newIndex;
        }
      });
    }, 600); // match CSS sliding out
  };

  useEffect(() => {
    const newItems = new Set(
      roomsCreated
        .slice(currentIndex, currentIndex + roomsPerPage)
        .map((room) => room.id)
    );
    setItemsToAnimateIn(newItems);
    
    const timer = setTimeout(() => {
      setItemsToAnimateIn(new Set());
    }, 800); // match css animation sliding in

    return () => clearTimeout(timer);
  }, [currentIndex, roomsPerPage, roomsCreated]);

  const displayedRooms = roomsCreated.slice(
    currentIndex,
    currentIndex + roomsPerPage
  );

  return (
    <>
      <div className={styles.rooms_wrapper}>
        <div className={styles.flex}>
          <span id={styles.display_created_room_name}>Created by You</span>
          <span id={styles.room_count}>
            {endIndex} of {roomsCreated.length}{" "}
          </span>
          <div className={styles.room_item_wrapper}>
            {displayedRooms.map((room) => {
              const isAnimatingOut = itemsToAnimateOut.has(room.id);
              const isAnimatingIn = itemsToAnimateIn.has(room.id);
              const roomClass = `${styles.room_item} ${
                isAnimatingOut
                  ? styles.slideOut
                  : isAnimatingIn
                  ? styles.slideIn
                  : ""
              }`;

              return (
                <div
                  key={room.id}
                  className={roomClass}
                  type="button"
                  value={room.room}>
                  <img
                    id={styles.room_owned_by_img}
                    src={userLoginInfo.imageUrl}
                    alt="owner"
                    height={40}
                  />
                  <p>{room.roomName}</p>
                </div>
              );
            })}
          </div>
          <div className={styles.flex_row}>
            <KeyboardDoubleArrowLeftTwoToneIcon
              id={styles.icon_left_right}
              onClick={() => changeRooms("left")}
            />
            <KeyboardDoubleArrowRightTwoToneIcon
              id={styles.icon_left_right}
              onClick={() => changeRooms("right")}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default RoomsCreated;
