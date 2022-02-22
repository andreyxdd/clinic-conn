import {
  useState, createContext, useContext, useEffect,
} from 'react';
import { io, Socket } from 'socket.io-client';
// import { fetcher } from '../lib/auth/csr';
import env from '../config/env';
import { IChat, IMessage } from '../config/types';
import useAuth from '../customHooks/useAuth';
import events from '../config/events';

interface IChatContext{
  socket: Socket;
  currentChat: IChat | null;
  setCurrentChat: Function;
  chats: Array<IChat>;
  setChats: Function;
}

const ChatContext = createContext<IChatContext | null>(null);
export const useChat = () => useContext(ChatContext) as IChatContext;

interface IChatProvider{
  children: React.ReactNode;
}

const ChatProvider = ({ children }: IChatProvider) => {
  // provider states
  const { user } = useAuth();
  const [currentChat, setCurrentChat] = useState<IChat | null>(null);
  const [chats, setChats] = useState<Array<IChat>>([]);
  // --

  // -- initiate a socket connection
  const [socket, setSocket] = useState<Socket>();
  useEffect(() => {
    const s = io(env.socket, {
      withCredentials: true,
      autoConnect: false,
      transports: ['websocket'],
      upgrade: false,
    });
    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, []);
  // --

  // -- socket authorization
  useEffect(() => {
    if (user && socket) {
      socket.auth = {
        username: user.username,
        userId: user.id,
      };
      socket.connect();
    }
    return () => {
      if (socket) socket.off(events.connection_error);
    };
  }, [user, socket]);
  // --

  // -- Handle Client Socket Object
  useEffect(() => {
    if (!socket) return;

    // use only in development
    socket.onAny((event, ...args) => {
      console.log(event, args);
    });

    // hadnling errors
    socket.on(events.connection_error, (err) => {
      console.log(err.message);
    });

    // getting all the user chats
    socket.on(events.SERVER.USER_CHATS, (userChats: Array<IChat>) => {
      setChats(userChats);
    });

    // getting new messages
    socket.on(events.SERVER.CHAT_MESSAGE, (content: IMessage, fromChat: number) => {
      setChats((currChats) => {
        const updatedChats = currChats.map((chat) => {
          if (chat.chatId === fromChat) {
            return { ...chat, messages: [...chat.messages, content] };
          }
          return { ...chat };
        });
        return updatedChats;
      });

      // if the chat is currently opened
      if (currentChat?.chatId === fromChat) {
        setCurrentChat((currChat: IChat | null) => {
          if (!currChat) return null;
          return ({
            ...currChat,
            messages: [...currChat.messages, content],
          });
        });
      }
    });
  }, [socket]);
  // --

  if (!socket) return <></>;

  return (
    <ChatContext.Provider value={{
      socket, currentChat, setCurrentChat, chats, setChats,
    }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
