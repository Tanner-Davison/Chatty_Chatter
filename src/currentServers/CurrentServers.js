import '../App.css';
import { useContext } from 'react';
import { LoginContext } from '../components/contexts/LoginContext';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
const CurrentServers = () =>{
    const {setMainAccess, setSocket} = useContext(LoginContext)
    const navigate = useNavigate();
    return(
    
    <button
                    className={"mainAccessBtn"}
                    onClick={() => {
                      setMainAccess(true);
                     setSocket(io.connect("http://localhost:3001"), {
      reconnection: true,
      reconnectionAttempts: 20,
      reconnectionDelay: 2000,
    },navigate('/chatroom'));
                    }}>
                    {" "}
                    Enter Main Room
                  </button>
    )
}
export default CurrentServers;