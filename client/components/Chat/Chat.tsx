import React from 'react';
import { useSockets } from '../../context/SocketContext';
import Messages from './Messages';
import Rooms from './Rooms';

interface IChatContainerProps {}

const ChatContainer: React.FC<IChatContainerProps> = () => {
  const { socket } = useSockets();
  return (
    <div>
      Hi:
      {' '}
      {socket.id}
      <Rooms />
      <Messages />
    </div>
  );
};

export default ChatContainer;
