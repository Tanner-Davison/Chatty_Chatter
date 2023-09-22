import { useState, useEffect } from "react";
import "./App.css";
import MainRoom from "./components/MainRoom";
import io from "socket.io-client";

function App() {
  const [mainAccess, setMainAccess] = useState(false)

  return (
    <header className={"App"}>
     { !mainAccess && <button onClick={() => {
        setMainAccess(true)
      }}>Enter Main Server</button>}
      {mainAccess && <MainRoom mainAccess={mainAccess}setMainAccess={setMainAccess} />}
    </header>
  );
}

export default App;
