import styles from "../Profile.module.css";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import WorkRoundedIcon from "@mui/icons-material/WorkRounded";
const AboutMe = ({ setEducation, setProfileBio, handleFormSubmit, setProfession }) => {
  return (
    <div className={styles.profile_form_wrapper}>
      <form id={styles.profile_form}>
        <div className={styles.about_me_wrapper}>
          <label htmlFor={"aboutme"} id={"aboutme"}>
            <span id={styles.spanIcons}>
              <FingerprintIcon /> whats your story
            </span>

            <textarea
              id="aboutme"
              className={styles.about_me}
              onChange={(e) => setProfileBio(e.target.value)}
              placeholder=" I work as a software engineer @ adobe ..."
              rows="7"
              maxLength={255}></textarea>
          </label>
          <div className={styles.occupation_education}>
            <label htmlFor="desireInput" style={{ gap: "10px" }}>
              <span id={styles.spanIcons}>
                <WorkRoundedIcon /> Profession
              </span>
              <input
                id={"radioInput"}
                require={"false"}
                className={styles.proffesion_input}
                onChange={(e) => setProfession(e.target.value)}
                type="text"
                maxLength={25}
                placeholder=" ex:) Developer ..."
              />
            </label>
            <label>
              <span id={styles.spanIcons}>
                {" "}
                <SchoolRoundedIcon /> Education
              </span>
            </label>
            <div className={styles.educationSection}>
              <label
                htmlFor="desireInput"
                id={"radioInput"}
                name={"education"}
                className={styles.labelInputs}>
                highschool
                <input
                  id={"radioInput"}
                  require={false}
                  name={"education"}
                  value={"highschool"}
                  className={styles.occupation_education_input}
                  onChange={(e) => setEducation(e.target.value)}
                  type="radio"
                  maxLength={25}
                  placeholder=" ex:) Developer ..."
                />
              </label>
              <label htmlFor="desireInput" className={styles.labelInputs}>
                2 years
                <input
                  id={"radioInput"}
                  name={"education"}
                  value={"2+ years"}
                  onChange={(e) => setEducation(e.target.value)}
                  require={false}
                  className={styles.occupation_education_input}
                  type="radio"
                  maxLength={25}
                  placeholder=" ex:) Developer ..."
                />
              </label>
              <label htmlFor="desireInput" className={styles.labelInputs}>
                4+ years
                <input
                  id={"desireInput"}
                  onChange={(e) => setEducation(e.target.value)}
                  require={false}
                  value={"4+ years"}
                  name={"education"}
                  className={styles.occupation_education_input}
                  type="radio"
                  maxLength={25}
                  placeholder=" ex:) Developer ..."
                />
              </label>
            </div>
            <button
              type={"submit"}
              id={styles.about_me_button}
              onClick={handleFormSubmit}>
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
export default AboutMe;
