import { Server, Socket } from 'socket.io';
import Message from '../entities/Message';
import { IMessage, IChat } from '../config/types';
import { getUserChatsViaSockets } from '../controllers/chatControllers';
import logger from '../utils/log';

const EVENTS = {
  connection: 'connection',
  connection_error: 'connection_error',
  disconnect: 'disconnect',
  CLIENT: {
    SEND_MESSAGE: 'SEND_MESSAGE',
    READ_MESSAGE: 'READ_MESSAGE',
    CALL: 'CALL',
    ANSWER_CALL: 'ANSWER_CALL',
    PEER: {
      SIGNAL: 'signal',
    },
  },
  SERVER: {
    CALL: 'CALL',
    CALL_ACCEPTED: 'CALL_ACCEPTED',
    CHAT_MESSAGE: 'CHAT_MESSAGE',
    USER_CHATS: 'USER_CHATS',
    READ_MESSAGE: 'READ_MESSAGE',
    NEW_CHAT: 'NEW_CHAT',
  },
};

function setSocket({ io }: { io: Server }) {
  logger.info('Sockets enabled');

  // -- socket middleware
  // user verification
  io.use((socket, next) => {
    const { userId, username } = socket.handshake.auth;
    if (!username || !userId) {
      return next(new Error('Chat Socket: Invalid User Credentials Provided'));
    }

    // eslint-disable-next-line no-param-reassign
    socket.data.username = username;
    // eslint-disable-next-line no-param-reassign
    socket.data.userId = userId;
    return next();
  });
  // --

  io.on(EVENTS.connection, async (socket: Socket) => {
    const { username, userId } = socket.data;

    logger.info(`User connected: \n - Socket id: ${socket.id} \n - Username: ${username} \n - User Id: ${userId}`);

    // -- getting all the chats related to the user
    const userChats = await getUserChatsViaSockets(userId, username);

    // creating and joining all the chat-rooms related to the given user
    userChats.forEach((elm) => {
      socket.join(`chat-${elm.chatId}`);
    });

    // sending the array back
    socket.emit(EVENTS.SERVER.USER_CHATS, userChats);
    // --

    // handling message sent from the client
    socket.on(EVENTS.CLIENT.SEND_MESSAGE, async (
      {
        content, chatId, newChat, targetUsername,
      }:
        {
          content: IMessage,
          chatId: number,
          newChat: IChat | undefined,
          targetUsername: string | undefined
        },
    ) => {
      const { sentAt, text } = content;
      await Message.insert({
        userId,
        chatId,
        text,
        sentAt,
      });

      if (newChat) {
        // determining if the target user online
        // it means that the corresponding socket is in array
        // of all sockets
        const allSockets = await io.fetchSockets();
        const targetScoket = allSockets.find(
          (s: any) => s.data.username === targetUsername,
        );
        if (targetScoket) {
          targetScoket.join(`chat-${chatId}`);
          targetScoket.emit(EVENTS.SERVER.NEW_CHAT, newChat);
        }
      } else {
        socket.to(`chat-${chatId}`).emit(EVENTS.SERVER.CHAT_MESSAGE, content, chatId);
      }
    });

    // reading last unread message
    socket.on(EVENTS.CLIENT.READ_MESSAGE, async ({ msgId, readAt }) => {
      await Message.update(
        { id: msgId },
        { readAt },
      );
    });

    // -- disconnecting
    socket.on(EVENTS.disconnect, () => {
      socket.broadcast.emit('callEnded');
      logger.info(`User disconnected: \n - Socket id: ${socket.id} \n - Username: ${username} \n - User Id: ${userId}`);
    });
    // --

    // -- video call handling
    socket.on(EVENTS.CLIENT.CALL, (data) => {
      const callId = `call-${data.callFromUsername}_${data.callToUsername}`;
      io.to(callId).emit(EVENTS.SERVER.CALL, {
        signal: data.signal,
        callToUsername: data.callToUsername,
        callFromUsername: data.callFromUsername,
      });
    });

    socket.on(EVENTS.CLIENT.ANSWER_CALL, (data) => {
      io.to(data.callId).emit('callAccepted', data.signal);
    });
  });
}

export default setSocket;
