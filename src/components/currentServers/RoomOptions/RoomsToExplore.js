import { useContext, useState, useEffect } from "react";
import { LoginContext } from "../../contexts/LoginContext";
import styles from "./RoomsCreated.module.css";
import axios from 'axios'
import KeyboardDoubleArrowRightTwoToneIcon from "@mui/icons-material/KeyboardDoubleArrowRightTwoTone";
import KeyboardDoubleArrowLeftTwoToneIcon from "@mui/icons-material/KeyboardDoubleArrowLeftTwoTone";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import RoomItem from "./RoomItem";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
const RoomsToExplore = ({ roomsCreated, handleClick }) => {
  const { userLoginInfo } = useContext(LoginContext);
  const [gridView, setGridView] = useState(false);
  const [roomsPerPage, setRoomsPerPage] = useState(4);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToAnimateOut, setItemsToAnimateOut] = useState(new Set());
  const [itemsToAnimateIn, setItemsToAnimateIn] = useState(new Set());
  const PORT = process.env.REACT_APP_PORT;
  const [allRooms, setAllRooms] =useState([]);
  const roomValues = roomsCreated.map((room)=> room.room)
  const [displayPrivateRooms, setDisplayPrivateRooms]=useState(false)

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
    console.log(allRooms);
    //eslint-disable-next-line
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
    //eslint-disable-next-line
  }, [currentIndex, roomsPerPage]);

  const displayedRooms = allRooms.slice(
    currentIndex,
    currentIndex + roomsPerPage
  );
    const handleShowPublicRoomData =(event)=>{
      event.preventDefault()
      console.log('this is running show data');
      setAllRooms((prev)=> prev.filter((room)=> room.private_room === false))
      setDisplayPrivateRooms(true);
    }
    const handlePrivateVisibilityClick = async (event)=>{
  
      console.log('this is running');
      const allIncludedRoomData = await getRoomData();
      if(allIncludedRoomData){
        setAllRooms(allIncludedRoomData)
      }
      setDisplayPrivateRooms(false)
    }
  return (
    <>
      <div className={styles.rooms_wrapper}>
        <div className={styles.flex}>
          <div className={styles.room_info}>
            <span id={styles.display_created_room_name}>Explore Hubs</span>
            {!displayPrivateRooms && (
              <VisibilityOutlinedIcon
                id={styles.private_rooms_visibility_icon}
                onClick={(event) => handleShowPublicRoomData(event)}
              />
            )}
            {displayPrivateRooms && (
              <VisibilityOffOutlinedIcon
                id={styles.private_rooms_visibility_icon}
                onClick={(event)=>{handlePrivateVisibilityClick(event)}}
              />
            )}
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
              const imageURL = room.messageHistory[0].imageUrl;
              const isAnimatingOut = itemsToAnimateOut.has(room.id);
              const isAnimatingIn = itemsToAnimateIn.has(room.id);
              const roomClass = `${styles.room_item} ${
                isAnimatingOut
                  ? styles.slideOut
                  : isAnimatingIn
                  ? styles.slideIn
                  : ""
              } ${room.private_room ? styles.room_public_private : " "}`;

              return (
                <RoomItem
                  key={room._id}
                  room={room}
                  roomClass={roomClass}
                  changeRooms={changeRooms}
                  imageURL={imageURL}
                  filterRooms={setAllRooms}
                  goToRoom={handleClick}
                  
                />
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

export default RoomsToExplore;
