import {
  useState, createContext, useContext, useEffect,
} from 'react';
import { io, Socket } from 'socket.io-client';
import env from '../config/env';
import EVENTS from '../config/events';
import { IMessage } from '../config/types';

const socket = io(env.socket, {
  withCredentials: true,
});

interface ISocketContext{
  socket: Socket;
  chatId: number | null;
  setChatId: Function;
  chats: object;
  setChats: Function;
  messages: Array<IMessage>;
  setMessages: Function;
}

const SocketContext = createContext<ISocketContext | null>(null);

interface ISocketProvider{
  children: React.ReactNode;
}

// eslint-disable-next-line max-len
const SocketsProvider = ({ children }: ISocketProvider) => {
  const [chatId, setChatId] = useState(null);
  const [chats, setChats] = useState({});
  const [messages, setMessages] = useState<Array<IMessage>>([]);

  // unmount message from the tab when focused
  useEffect(() => {
    window.onfocus = () => {
      document.title = 'WME: Chat';
    };
  }, []);

  socket.on(EVENTS.SERVER.ROOMS, (value) => {
    setChats(value);
  });

  socket.on(EVENTS.SERVER.JOINED_ROOM, (value) => {
    setChatId(value);

    setMessages([]);
  });

  socket.on(EVENTS.SERVER.ROOM_MESSAGE, (newMessage: IMessage) => {
    // show message on the tab if not focused
    if (!document.hasFocus()) {
      document.title = 'New message ...';
    }

    setMessages([...messages, newMessage]);
  });

  return (
    <SocketContext.Provider value={{
      socket, chatId, setChatId, chats, setChats, messages, setMessages,
    }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSockets = () => useContext(SocketContext) as ISocketContext;

export default SocketsProvider;
