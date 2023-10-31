import { useRef } from "react";

export const useIsTyping = (socket, username, room, typingTimeoutId) => {
  
  const handleIsTyping = (event) => {
    if(event.keyCode === 8){
      return;
    }
    clearTimeout(typingTimeoutId.current);

    typingTimeoutId.current = setTimeout(() => {
      const data = {
        username: username,
        room: room,
      };
      socket.emit("typing", data);
      console.log("working");
    }, 300);
  };

  return handleIsTyping;
};
