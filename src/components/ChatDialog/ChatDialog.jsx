import React, { useState } from 'react';
import './ChatDialog.css';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';

const ChatDialog = ({ personalData, onClose, onSendMessage, messages, isConnected }) => {
   const [message, setMessage] = useState('');

   const handleSendClick = () => {
      if (!isConnected) {
         alert('WebSocket connection is not established.');
         return;
      }

      if (message.trim() !== '') {
         onSendMessage(message);
         setMessage('');
      }
   };

   return (
      <div className="chat-dialog">
         <div className="chat-dialog-content">
            <div className="chat-dialog-header">
               <h4>Chat với <span>{personalData.lastName}</span></h4>
               <CloseIcon className='close-log' onClick={onClose} />
            </div>
            <div className="chat-messages">
               {messages.map((msg, index) => (
                  <p key={index}>{msg.content}</p>
               ))}
            </div>
            <div className="chat-dialog-input">
               <input
                  type="text"
                  placeholder="Nhập tin nhắn..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
               />
               <SendIcon className='icon' onClick={handleSendClick} />
            </div>
         </div>
      </div>
   );
};

export default ChatDialog;
