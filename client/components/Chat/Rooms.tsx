import React, { MutableRefObject, useRef } from 'react';
import EVENTS from '../../config/events';
import { useSockets } from '../../context/SocketContext';

interface IRooms {}

const Rooms: React.FC<IRooms> = () => {
  const { socket, chatId, chats } = useSockets();

  const newRoomRef: MutableRefObject<HTMLInputElement | null> = useRef(null);

  const handleCreateRoom = () => {
    // get the room name
    if (newRoomRef.current !== null) {
      const roomName = newRoomRef.current.value || '';

      // roomName can't be just white space
      if (!String(roomName).trim()) return;

      // emit room created event
      socket.emit(EVENTS.CLIENT.CREATE_ROOM, roomName);

      newRoomRef.current.value = '';
    }
  };

  const handleJoinRoom = (key: number) => {
    // already in this room
    if (key === chatId) return;

    socket.emit(EVENTS.CLIENT.JOIN_ROOM, key);
  };

  return (
    <nav>
      <div>
        <input ref={newRoomRef} placeholder='Room name' />
        <button type='button' onClick={handleCreateRoom}>Create Room</button>
      </div>
      {Object.keys(chats).map((key) => (
        <div key={key}>
          <button
            type='button'
            // disabled={key === chatId}
            // title={`Join ${chats[key].name}`}
            onClick={() => { handleJoinRoom(1); }}
          >
            {/* chats[key].name */}
          </button>
        </div>
      ))}
    </nav>
  );
};

export default Rooms;
