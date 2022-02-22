// import { nanoid } from 'nanoid';
import { Server, Socket } from 'socket.io';
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

/*
interface IRoomMessage {
  roomId: string;
  message: string;
  username: string;
}
*/

// const rooms: Record<string, { name: string }> = {};

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

    // getting all the chats related to the user
    const userChats = await getUserChatsViaSockets(userId, username);

    // creating and joining all the chat-rooms related to the given user
    userChats.forEach((elm) => {
      socket.join(`chat-${elm.chatId}`);
    });

    // sending the array back
    socket.emit(EVENTS.SERVER.USER_CHATS, userChats);

    // handling message sent from the client
    socket.on(EVENTS.CLIENT.SEND_MESSAGE, async (
      { content, to }: {content: IMessage, to: string},
    ) => {
      // 'to' is a chatId
      socket.to(to).emit(EVENTS.SERVER.CHAT_MESSAGE, content);
    });

    // disconnecting
    socket.on('disconnect', () => {
      logger.info(`User disconnected: \n - Socket id: ${socket.id} \n - Username: ${username} \n - User Id: ${userId}`);
    });
  });

  /* OLD
  io.on(EVENTS.connection, (socket: Socket) => {
    logger.info(`User connected ${socket.id}`);

    // -- User creates a new room
    socket.on(EVENTS.CLIENT.CREATE_ROOM, (roomName: string) => {
      logger.info(roomName);

      // create a roomId
      const roomId = nanoid();

      // add a new room to the rooms object
      rooms[roomId] = {
        name: roomName,
      };

      // join room
      socket.join(roomId);

      // broadcast an event saying there is a new room
      // broadcast evebt on for all sockets but the one broadcasting
      socket.broadcast.emit(EVENTS.SERVER.ROOMS, rooms);

      // emit back to the room creator with all the rooms
      socket.emit(EVENTS.SERVER.ROOMS, rooms);

      // emit event back the room creator saying they have joined a room
      socket.emit(EVENTS.SERVER.JOINED_ROOM, roomId);
    });
    // --

    // -- User sends a message (in a given room)
    socket.on(EVENTS.CLIENT.SEND_ROOM_MESSAGE, ({ roomId, message, username } : IRoomMessage) => {
      const date = new Date();

      socket.to(roomId).emit(EVENTS.SERVER.ROOM_MESSAGE, {
        message, username, time: `${date.getHours()}:${date.getMinutes()}`,
      });
    });
    // --

    // -- User joins the room
    socket.on(EVENTS.CLIENT.JOIN_ROOM, (roomId : string) => {
      socket.join(roomId);

      // emit event back the room creator saying they have joined a room
      socket.emit(EVENTS.SERVER.JOINED_ROOM, roomId);
    });
    // --
  });
  */
}

export default chatSocket;
