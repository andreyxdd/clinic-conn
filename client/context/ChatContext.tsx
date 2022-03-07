import {
  useState, createContext, useContext,
  useEffect, useRef, MutableRefObject,
} from 'react';
import { io, Socket } from 'socket.io-client';
import Peer from 'simple-peer';
import env from '../config/env';
import { IChat, IMessage, ICall } from '../config/types';
import useAuth from '../customHooks/useAuth';
import events from '../config/events';

interface IChatContext{
  socket: Socket;
  currentChat: IChat | null;
  setCurrentChat: Function;
  chats: Array<IChat>;
  setChats: Function;
  call: ICall | null;
  stream: MediaStream | undefined;
  callAccepted: boolean;
  callEnded: boolean;
  userVideoRef: MutableRefObject<HTMLVideoElement | null>;
  oppositeUserVideoRef: MutableRefObject<HTMLVideoElement | null>;
  answerCall: Function;
  makeCall: Function;
  stopCall: Function;
  openVideoCallModal: boolean;
  setOpenVideoCallModal: Function;
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

  // -- Handle text-messaging socket events
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
      userChats.map((obj: IChat) => ({ ...obj, active: false }));
      setChats(userChats);
    });

    // another user initiates new chat
    socket.on(events.SERVER.NEW_CHAT, (newChat: IChat) => {
      setChats((currChats: Array<IChat>) => ([
        ...currChats,
        { ...newChat, active: false },
      ]));
    });

    // getting new messages
    socket.on(events.SERVER.CHAT_MESSAGE, (content: IMessage, fromChatId: number) => {
      setChats((currChats) => {
        const updatedChats = currChats.map((chat) => {
          if (chat.chatId === fromChatId) {
            return { ...chat, messages: [...chat.messages, content] };
          }

          return { ...chat };
        });
        return updatedChats;
      });
    });
  }, [socket]);
  // --

  // -- Handle video-call socket events
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [call, setCall] = useState<ICall | null>(null);
  const [stream, setStream] = useState<MediaStream | undefined>();
  const [openVideoCallModal, setOpenVideoCallModal] = useState(false);

  const userVideoRef: MutableRefObject<HTMLVideoElement | null> = useRef(null);
  const oppositeUserVideoRef: MutableRefObject<HTMLVideoElement | null> = useRef(null);
  const connectionRef: MutableRefObject<Peer.Instance | null> = useRef(null);

  useEffect(() => {
    if (!socket) return;

    socket.on(events.SERVER.CALL, (
      { signal, callToUsername, callFromUsername },
    ) => {
      setCall({
        isReceivingCall: true,
        signal,
        callToUsername,
        callFromUsername,
      });
    });
  }, []);

  useEffect(() => {
    if (!navigator) return;

    if (openVideoCallModal) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((currentStream) => {
          setStream(currentStream);

          if (userVideoRef.current !== null) {
            userVideoRef.current.srcObject = currentStream;
          } else {
            console.log('Failed setting current stream');
          }
        });
    } else {
      setStream((currStream) => {
        currStream?.getTracks().forEach((track) => {
          if (track.readyState === 'live') {
            if (track.enabled) {
              track.stop();
              // eslint-disable-next-line no-param-reassign
              track.enabled = false;
            }
          }
        });
        return undefined;
      });
    }
  }, [openVideoCallModal]);

  const answerCall = () => {
    if (!socket) {
      console.log(`Socket object is ${socket}`);
      return;
    }

    if (!call) {
      console.log(`Call object is ${call}`);
      return;
    }

    setCallAccepted(true);

    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on(events.CLIENT.PEER.SIGNAL, (data) => {
      socket.emit(events.CLIENT.ANSWER_CALL,
        {
          signal: data,
          callId: `call-${call.callFromUsername}_${call.callToUsername}`,
        });
    });

    peer.on(events.CLIENT.PEER.STREAM, (currentStream) => {
      if (userVideoRef.current !== null) {
        userVideoRef.current.srcObject = currentStream;
      } else {
        console.log('Failed setting current stream when answering a call');
      }
    });

    peer.signal(call.signal);

    connectionRef.current = peer;
  };

  const makeCall = (chat: IChat) => {
    if (!socket) {
      console.log(`Socket object is ${socket}`);
      return;
    }

    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on(events.CLIENT.PEER.SIGNAL, (data) => {
      socket.emit(events.CLIENT.CALL, {
        callToUsername: chat.participantUsername,
        callFromUsername: user?.username,
        signal: data,
      });
    });

    peer.on(events.CLIENT.PEER.STREAM, (currentStream) => {
      if (oppositeUserVideoRef.current !== null) {
        oppositeUserVideoRef.current.srcObject = currentStream;
      } else {
        console.log('Failed setting current stream of the opposite user');
      }
    });

    socket.on(events.SERVER.CALL_ACCEPTED, (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const stopCall = () => {
    setCallEnded(true);

    if (connectionRef.current) {
      connectionRef.current.destroy();
    } else {
      console.log('Failed to destory connection');
    }
  };
  // --

  if (!socket) return <></>;

  return (
    <ChatContext.Provider value={{
      socket,
      currentChat,
      setCurrentChat,
      chats,
      setChats,
      call,
      stream,
      callAccepted,
      callEnded,
      userVideoRef,
      oppositeUserVideoRef,
      answerCall,
      makeCall,
      stopCall,
      openVideoCallModal,
      setOpenVideoCallModal,
    }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
