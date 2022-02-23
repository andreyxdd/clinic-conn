import { Server, Socket } from 'socket.io';
import Message from '../entities/Message';
import { IMessage } from '../config/types';
import { getUserChatsViaSockets } from '../controllers/chatControllers';
import logger from '../utils/log';

const EVENTS = {
  connection: 'connection',
  CLIENT: {
    CREATE_ROOM: 'CREATE_ROOM',
    SEND_MESSAGE: 'SEND_MESSAGE',
    JOIN_ROOM: 'JOIN_ROOM',
  },
  SERVER: {
    ROOMS: 'ROOMS',
    JOINED_ROOM: 'JOINED_ROOM',
    CHAT_MESSAGE: 'CHAT_MESSAGE',
    USER_CHATS: 'USER_CHATS',
  },
};

function chatSocket({ io }: { io: Server }) {
  logger.info('Chat Sockets enabled');

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
      { content, chatId }: {content: IMessage, chatId: number},
    ) => {
      const { sentAt, text } = content;
      await Message.insert({
        userId,
        chatId,
        text,
        sentAt,
      });

      // 'to' is a room id (eg 'chatId-1')
      socket.to(`chat-${chatId}`).emit(EVENTS.SERVER.CHAT_MESSAGE, content);
    });

    // disconnecting
    socket.on('disconnect', () => {
      logger.info(`User disconnected: \n - Socket id: ${socket.id} \n - Username: ${username} \n - User Id: ${userId}`);
    });
  });
}

export default chatSocket;
