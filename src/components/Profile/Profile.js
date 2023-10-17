import { useParams } from "react-router-dom";
import Header from "../Header/Header";
function Profile() {
  const {username} = useParams();

  // make a getUserInfo Function essentially just get all the user info and display it here the username params is what you are going to search in the DB
  // const userInfo = // make a get request;

  return (
    <>
      <Header />
      <div style={{ color: "white" }}>
        Profile for ID: <h1 style={{ color: "white" }}>{username} </h1>
      </div>
    </>
  );
}
export default Profile;