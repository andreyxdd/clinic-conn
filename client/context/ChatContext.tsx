import {
  useState, createContext, useContext, useEffect,
} from 'react';
import { io, Socket } from 'socket.io-client';
import { fetcher } from '../lib/auth/csr';
import env from '../config/env';
import { IChat } from '../config/types';

const socket = io(env.socket, {
  withCredentials: true,
});

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

// TODO: consider using SWR in this context
const ChatProvider = ({ children }: IChatProvider) => {
  const [currentChat, setCurrentChat] = useState<IChat | null>(null);
  const [chats, setChats] = useState<Array<IChat>>([]);

  useEffect(() => {
    const getUserChats = async () => {
      const res = await fetcher<Array<IChat>>(`${env.api}/chat/get_user_chats`);
      if (res.data) setChats(res.data);
    };
    getUserChats();
  }, []);

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
