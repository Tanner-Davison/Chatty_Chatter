
export const useIsTyping = (socket, username, room, typingTimeoutId) => {
  const handleIsTyping = (event) => {
    if (event.nativeEvent.inputType === "deleteContentBackward") {
      return;
    }

    clearTimeout(typingTimeoutId.current);

    typingTimeoutId.current = setTimeout(() => {
      const data = {
        username: username,
        room: room,
      };
      socket.emit("typing", data);
    }, 300);
  };

  return handleIsTyping;
};
