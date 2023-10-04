import './CurrentServer.css'
import { useContext } from 'react';
import { LoginContext } from '../contexts/LoginContext';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
const CurrentServers = () =>{
    const {setMainAccess, setSocket} = useContext(LoginContext)
    const navigate = useNavigate();
    return (
			<div className='server-selection'>
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
		);
}
export default CurrentServers;