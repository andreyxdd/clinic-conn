import React, { MutableRefObject, useRef } from 'react';
import EVENTS from '../../config/events';
import { useSockets } from '../../context/SocketContext';
import useAuth from '../../customHooks/useAuth';

interface IMessages {}

const Messages: React.FC<IMessages> = () => {
  const {
    socket, messages, chatId, setMessages,
  } = useSockets();
  const { user } = useAuth();
  const newMessageRef: MutableRefObject<HTMLTextAreaElement | null> = useRef(null);

  const handleSendMessages = () => {
    if (newMessageRef.current !== null) {
      const message = newMessageRef.current.value;

      // can't send white space
      if (!String(message).trim()) return;

      socket.emit(EVENTS.CLIENT.SEND_ROOM_MESSAGE, { chatId, message, username: user!.username });

      const date = new Date();

      setMessages(
        [...messages,
          {
            username: 'You',
            message,
            time: `${date.getHours()}:${date.getMinutes()}`,
          }],
      );

      newMessageRef.current.value = '';
    }
  };

  if (!chatId) return <div />;

  return (
    <div>
      {messages.map(({ message }, idx) => <p key={`${message}-${idx * 2}`}>{message}</p>)}
      <div>
        <textarea rows={1} placeholder='Write message' ref={newMessageRef} />
        <button type='button' onClick={handleSendMessages}>SEND</button>
      </div>
    </div>
  );
};

export default Messages;
