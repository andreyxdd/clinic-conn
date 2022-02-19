import { nanoid } from 'nanoid';
import { Server, Socket } from 'socket.io';
import logger from '../utils/log';

const EVENTS = {
  connection: 'connection',
  CLIENT: {
    CREATE_ROOM: 'CREATE_ROOM',
    SEND_ROOM_MESSAGE: 'SEND_ROOM_MESSAGE',
    JOIN_ROOM: 'JOIN_ROOM',
  },
  SERVER: {
    ROOMS: 'ROOMS',
    JOINED_ROOM: 'JOINED_ROOM',
    ROOM_MESSAGE: 'ROOM_MESSAGE',
  },
};

interface IRoomMessage {
  roomId: string;
  message: string;
  username: string;
}

const rooms: Record<string, { name: string }> = {};

function chatSocket({ io }: { io: Server }) {
  logger.info('Chat Sockets enabled');

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
}

export default chatSocket;
