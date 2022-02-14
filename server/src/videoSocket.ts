import { Server, Socket } from 'socket.io';
import logger from './utils/logUtils';

const EVENTS = {
  connection: 'connection',
  CLIENT: {
    CREATE_CALL: 'CREATE_CALL',
    SERVER: {
      CALL: 'CALL',
    },
  },
};

// const rooms: Record<string, { name: string }> = {};

function videoSocket({ io }: { io: Server }) {
  logger.info('Sockets enabled');

  io.on(EVENTS.connection, (socket: Socket) => {
    logger.info(`User connected ${socket.id}`);

    socket.emit('me', socket.id);

    socket.on('disconnect', () => {
      socket.broadcast.emit('callEnded');
    });

    socket.on('callUser', (data) => {
      io.to(data.userToCall).emit('callUser', {
        signal: data.signalData,
        from: data.from,
        name: data.name,
      });
    });

    socket.on('answerCall', (data) => {
      io.to(data.to).emit('callAccepted', data.signal);
    });
  });
}

export default videoSocket;
