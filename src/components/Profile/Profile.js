import { useParams } from "react-router-dom";

function Profile() {
  const { usernameLocal } = useParams();

  // Now you can use the "id" value in your component logic

  return <div>Profile for ID: {usernameLocal}</div>;
}
export default Profile;