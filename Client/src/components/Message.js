import React from 'react';
import "./Utility-mainRoom/TypingComp.css";
const Message = ({ msg }) => {
  const renderMessage = (message) => {
    const urlPattern = /https?:\/\/[^\s]+/g;
    const parts = message.split(urlPattern);
    const links = message.match(urlPattern) || [];

    return parts.map((part, index) => {
      const link = links[index - 1]; // Get the corresponding link for the current part
      return (
        <React.Fragment key={index}>
          {part}
          {link && <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>}
        </React.Fragment>
      );
    });
  };

  
  return (
 
      <p className={"message-content"}>
        {renderMessage(msg.message)}
      </p>
  );
};

export default Message;