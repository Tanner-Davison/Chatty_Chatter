import { useState, useEffect } from "react";
import styles from './DotsComp.module.css'
const DotsComp = ({ typer }) => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setDots((prevDots) => {
        if (prevDots.length >= 3) {
          return "";
        }
        return prevDots + ".";
      });
    }, 400);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.flex_dots}>
      <p>
        {typer} <em> is Editing</em>
        <span id={styles.dots}> {dots} </span>{" "}
      </p>
    </div>
  );
};
export default DotsComp;
