import { useContext} from "react";
import { LoginContext } from "../../contexts/LoginContext";


const RoomsCreated = ({roomsCreated}) => {
    const {
        userLoginInfo
    } = useContext(LoginContext)
console.log(roomsCreated)
    return (
      <>
        <div>
          <h2>Created Rooms</h2>
        </div>
            <div>
                <img src={userLoginInfo.imageUrl} alt={"profile-pic"} height="100" />
                
            </div>
      </>
    );
}
export default RoomsCreated