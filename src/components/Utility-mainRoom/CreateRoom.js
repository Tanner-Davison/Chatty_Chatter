import {useState} from 'react';
import './CreateRoom.css'
import toggleOff from './svgs/toggleOff.svg';
import toggleOn from './svgs/toggleOn.svg';

const CreateRoom = (props)=>{
    const username = props.username;
    const room = props.room;
    const [privateRoom, setPrivateRoom] = useState(true)
    

    return (
			<form>
				<div className={"wrapper"}>
					<h1>Create Room?</h1>
					<div className={"question-wrapper"}>
						<h3>Public / Private : </h3>
						<div className={"toggle-wrapper"}>
							<p className={privateRoom ? "public-off true" : "public-off"}>Public</p>
							<img
								src={privateRoom ? toggleOff : toggleOn}
								alt={"toggleOff"}
								height={40}
								className={'toggleSvg'}
								onClick={() => setPrivateRoom(!privateRoom)}
							/>
							<p className={privateRoom ? "public-off" : "public-off true"}>
								Private
							</p>
            </div>
            <p>hello</p>
					</div>
				</div>
			</form>
		);
}
export default CreateRoom