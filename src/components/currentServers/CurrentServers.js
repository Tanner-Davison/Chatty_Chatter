import './CurrentServer.css'
import { useContext,useEffect } from 'react';
import { LoginContext } from '../contexts/LoginContext';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
const CurrentServers = () =>{
    const {setMainAccess, setSocket,socket} = useContext(LoginContext)
    const navigate = useNavigate();
    const doesUserExist = JSON.parse(localStorage.getItem('username'));

    useEffect(()=>{
      doesUserExist ?  console.log(doesUserExist):navigate('/')
    })
    return (
      <>
        <Header socket={socket}/>
        <div className="server-selection">
          <button
            className={"mainAccessBtn"}
            onClick={() => {
              setMainAccess(true);
              setSocket(
                io.connect("http://localhost:3001"),
                {
                  reconnection: true,
                  reconnectionAttempts: 20,
                  reconnectionDelay: 2000,
                },
                navigate("/chatroom")
              );
            }}>
            {" "}
            Enter Main Room
          </button>
        </div>
      </>
    );
}
export default CurrentServers;