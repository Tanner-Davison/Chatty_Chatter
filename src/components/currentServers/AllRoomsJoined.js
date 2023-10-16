import axios from 'axios'


const AllRoomsJoined = async (username)=>{
console.log(typeof username)

const roomsArray = await axios.get(`http://localhost:3001/api/users/${username}/rooms`);
const data = roomsArray.data;
console.log(data)

if (data){
return data
}else{
    return [];
}

}

export {AllRoomsJoined};