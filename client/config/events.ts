const EVENTS = {
  connection: 'connection',
  connection_error: 'connection_error',
  CLIENT: {
    SEND_MESSAGE: 'SEND_MESSAGE',
    CALL: 'CALL',
    ANSWER_CALL: 'ANSWER_CALL',
    PEER: {
      SIGNAL: 'signal',
      STREAM: 'stream',
    },
  },
  SERVER: {
    CALL: 'CALL',
    CALL_ACCEPTED: 'CALL_ACCEPTED',
    CHAT_MESSAGE: 'CHAT_MESSAGE',
    USER_CHATS: 'USER_CHATS',
  },
};

export default EVENTS;
