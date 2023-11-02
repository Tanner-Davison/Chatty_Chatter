import { useContext, useState } from "react";
import { LoginContext } from "../../contexts/LoginContext";
import styles from "./RoomsCreated.module.css";
import KeyboardDoubleArrowRightTwoToneIcon from "@mui/icons-material/KeyboardDoubleArrowRightTwoTone";
import KeyboardDoubleArrowLeftTwoToneIcon from "@mui/icons-material/KeyboardDoubleArrowLeftTwoTone";
const RoomsCreated = ({ roomsCreated }) => {
  const { userLoginInfo } = useContext(LoginContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const roomsPerPage = 4;

  const displayedRooms = roomsCreated.slice(
    currentIndex,
    currentIndex + roomsPerPage
  );

  const endIndex = Math.min(currentIndex + roomsPerPage, roomsCreated.length);

  const goLeft = () => {
    if (currentIndex >= roomsPerPage) {
      setCurrentIndex(currentIndex - roomsPerPage);
    } else {
      setCurrentIndex(0); 
    }
  };

  const goRight = () => {
    if (currentIndex < roomsCreated.length - roomsPerPage) {
      setCurrentIndex(currentIndex + roomsPerPage);
    } else {
      setCurrentIndex(0);
    }
  };

  return (
    <>
      <div className={styles.rooms_wrapper}>
        <div className={styles.flex}>
          <span id={styles.display_created_room_name}>Created by You</span>
          <span id={styles.room_count}>
            {endIndex} of {roomsCreated.length}{" "}
          </span>
          <div className={styles.flex_row}></div>
          <div className={styles.room_item_wrapper}>
            {displayedRooms.map((room) => {
              return (
                <div
                  className={styles.room_item}
                  type="button"
                  value={room.room}>
                  <img
                    id={styles.room_owned_by_img}
                    src={userLoginInfo.imageUrl}
                    alt={"owner"}
                    height={40}
                  />
                  <p> {room.roomName}</p>
                </div>
              );
            })}
          </div>
          <div className={styles.flex_row}>
            <KeyboardDoubleArrowLeftTwoToneIcon
              id={styles.icon_left_right}
              onClick={goLeft}
            />
            <KeyboardDoubleArrowRightTwoToneIcon
              id={styles.icon_left_right}
              onClick={goRight}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default RoomsCreated;