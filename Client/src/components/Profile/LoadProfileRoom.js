import axios from "axios"

const LoadProfileRoom =async(username)=>{
    const profileInfo = await axios.get(`/user_info/${username}`);

    if(profileInfo.data){
        console.log(profileInfo.data)
       return profileInfo.data;
        
    }else{
        console.log(profileInfo)
        return;
    }
}
export {LoadProfileRoom}
