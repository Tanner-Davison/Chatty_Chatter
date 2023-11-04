import { useContext, useState, useEffect } from "react";
import { LoginContext } from "../../contexts/LoginContext";
import styles from "./RoomsCreated.module.css";
import KeyboardDoubleArrowRightTwoToneIcon from "@mui/icons-material/KeyboardDoubleArrowRightTwoTone";
import KeyboardDoubleArrowLeftTwoToneIcon from "@mui/icons-material/KeyboardDoubleArrowLeftTwoTone";
import { Tilt } from "react-tilt";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import axios from 'axios'
const AllRoomsCreated = ({ roomsCreated, handleClick }) => {
  const { userLoginInfo } = useContext(LoginContext);
  const [gridView, setGridView] = useState(false);
  const [roomsPerPage, setRoomsPerPage] = useState(4);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToAnimateOut, setItemsToAnimateOut] = useState(new Set());
  const [itemsToAnimateIn, setItemsToAnimateIn] = useState(new Set());
  const PORT = process.env.REACT_APP_PORT;
  const [allRooms, setAllRooms] =useState([]);
  const roomValues = roomsCreated.map((room)=> room.room)
  const getRoomData = async () => {
    try {
      const response = await axios.get(`${PORT}/get_all_rooms`,{
        params: {rooms: roomValues}
      });
      if (response.data) {
        // Assuming the data is an array of rooms
        const roomData = response.data;
        setAllRooms(roomData);
      }
    } catch (error) {
      // Handle any errors that occur during the request
      console.error(error);
    }
  };
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
    allRooms.length
  );

  const changeRooms = (direction) => {
    setItemsToAnimateOut(new Set(displayedRooms.map((room) => room.id)));
    setTimeout(() => {
      setItemsToAnimateOut(new Set());
      setCurrentIndex((prevIndex) => {
        if (direction === "left") {
          const newIndex = prevIndex - roomsPerPage;
          return newIndex < 0
            ? allRooms.length - roomsPerPage
            : newIndex;
        } else {
          const newIndex = prevIndex + roomsPerPage;
          return newIndex >= allRooms.length ? 0 : newIndex;
        }
      });
    }, 600); // match CSS sliding out
  };
  useEffect(()=>{
     getRoomData();
     console.log(allRooms)
  },[roomsCreated])
  useEffect(() => {
    const newItems = new Set(
      allRooms
        .slice(currentIndex, currentIndex + roomsPerPage)
        .map((room) => room.id)
    );
    setItemsToAnimateIn(newItems);

    const timer = setTimeout(() => {
      setItemsToAnimateIn(new Set());
    }, 800); // match css animation sliding in

    return () => clearTimeout(timer);
  }, [currentIndex, roomsPerPage]);

  const displayedRooms = allRooms.slice(
    currentIndex,
    currentIndex + roomsPerPage
  );

  return (
    <>
      <div className={styles.rooms_wrapper}>
        <div className={styles.flex}>
          <div className={styles.room_info}>
            <span id={styles.display_created_room_name}>
              All Room Hubs
            </span>
          </div>
          <div
            className={
              !gridView ? styles.room_item_wrapper : styles.grid_view_wrapper
            }>
            <GridViewRoundedIcon
              id={styles.grid_view_icon}
              onClick={() => {
                setGridView((prev) => !prev);
                if (roomsPerPage === 4) {
                  setRoomsPerPage(allRooms.length);
                } else {
                  setRoomsPerPage(4);
                }
              }}
            />
            {displayedRooms.map((room) => {
              const isAnimatingOut = itemsToAnimateOut.has(room.id);
              const isAnimatingIn = itemsToAnimateIn.has(room.id);
              const roomClass = `${styles.room_item} ${
                isAnimatingOut
                  ? styles.slideOut
                  : isAnimatingIn
                  ? styles.slideIn
                  : ""
              } ${room.private_room ? styles.room_private : " "}`;

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
                    <p>{room.room_name}</p>
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
                  {endIndex} of {allRooms.length}
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

export default AllRoomsCreated;
