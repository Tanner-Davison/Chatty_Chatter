import { useState} from "react";
import "./App.css";
import MainRoom from "./components/MainRoom";
import Login from "./components/login/Login";
function App() {
  const [mainAccess, setMainAccess] = useState(false);
 
 

  return (
    <header className={"App"}>
      <div className={"App-body"}>
        {!mainAccess && (
          <>
            <Login />
            <button
              className={"mainAccessBtn"}
              onClick={() => {
                setMainAccess(true);
              }}>
              {" "}
              Join Community Chatter
            </button>
          </>
        )}

        {mainAccess && (
          <MainRoom mainAccess={mainAccess} setMainAccess={setMainAccess} />
        )}
      </div>
    </header>
  );
}

export default App;
