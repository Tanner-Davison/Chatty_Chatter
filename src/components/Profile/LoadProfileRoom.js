import axios from "axios"


const LoadProfileRoom =async(username)=>{
    const profileInfo = await axios.get(`http://localhost:3001/user_info/${username}`);

    if(profileInfo.data){
       return profileInfo.data;
        
    }else{
        console.log(profileInfo)
        return;
    }
}
export {LoadProfileRoom}
