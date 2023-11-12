import styles from "./ProfilePage.module.css";
const ProfilePage = ({ userData }) => {
  console.log(userData);
  const friendsCount = userData.friends ? userData.friends.length : "0";
  const profession = userData.profession ? userData.profession : "unkown";
  const education = userData.education ? userData.education : "unknown";
  const userBio = userData.profileBio ? userData.profileBio : "unkown";
  return (
    <>
      <div className={styles.profile_main_container_body}>
        <div className={styles.profile_info_wrapper}>
          <div className={styles.bio_wrapper}>
            <h2>Bio</h2>
            <div className={styles.bio}>
              <p>{userBio}</p>
            </div>
          </div>
          <div className={styles.aboutYouWrapper}>
            <div id={styles.flex}>
              <h2>Friends</h2>
              <p id={styles.friends_count}>
                <em>{friendsCount}</em>
              </p>
            </div>
            <div id={styles.flex}>
              <h2>Occupation</h2>
              <p id={styles.friends_count}>
                <em>{profession}</em>
              </p>
            </div>
            <div id={styles.flex}>
              <h2> Education</h2>
              <p id={styles.friends_count}>
                <em>{education}</em>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default ProfilePage;
