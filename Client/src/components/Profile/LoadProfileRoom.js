import axios from "axios"

const LoadProfileRoom =async(username)=>{
    const profileInfo = await axios.get(`/user_info/${username}`);

    if(profileInfo.data){
       return profileInfo.data;
        
    }else{
      
        return;
    }
}
export {LoadProfileRoom}
