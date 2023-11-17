import axios from "axios"
const PORT = ''

const LoadProfileRoom =async(username)=>{
    const profileInfo = await axios.get(`${PORT}/user_info/${username}`);

    if(profileInfo.data){
        console.log(profileInfo.data)
       return profileInfo.data;
        
    }else{
        console.log(profileInfo)
        return;
    }
}
export {LoadProfileRoom}
