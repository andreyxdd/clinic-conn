const EVENTS = {
  connection: 'connection',
  connection_error: 'connection_error',
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

export default EVENTS;
