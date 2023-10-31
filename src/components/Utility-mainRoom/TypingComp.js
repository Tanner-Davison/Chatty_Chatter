import {useState, useEffect} from 'react'
import './TypingComp.css'
const TypingComp = ({typer}) =>{
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
    <div className={"flex-dots"}>
      <p>
        {typer} <em> is typing</em>
        <span id="dots"> {dots} </span>{" "}
      </p>
    </div>
  );
}
export default TypingComp;