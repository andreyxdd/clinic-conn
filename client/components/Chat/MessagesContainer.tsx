import { Grid } from '@mui/material';
import React, { MutableRefObject } from 'react';
import { useChat } from '../../context/ChatContext';
import useAuth from '../../customHooks/useAuth';
import { IMessage } from '../../config/types';

interface IMessagesContainer {
  xs: number
}

const MessagesContainer: React.FC<IMessagesContainer> = ({ xs }) => {
  const { currentChat } = useChat();
  const { user } = useAuth();
  const newMessageRef: MutableRefObject<HTMLTextAreaElement | null> = React.useRef(null);

  const handleSendMessages = () => {
    if (newMessageRef.current !== null) {
      const message = newMessageRef.current.value;

      // can't send white space
      if (!String(message).trim()) return;

      /*
      const date = new Date();
      const content = {
        username: 'You',
        fromSelf: true,
        message,
        time: `${date.getHours()}:${date.getMinutes()}`,
      };

      socket.emit('private message', {
        content,
        to: currentUsername.userId,
      });

      setMessages(
        [...messages,
          content],
      );
      */

      newMessageRef.current.value = '';
    }
  };

  if (!currentChat) return <Grid item xs={xs}>Select chat to start messaging</Grid>;
  if (!user) return <Grid item xs={xs}>Sorry this content is not availble for non-users</Grid>;

  return (
    <Grid item xs={xs} container direction='column' justifyContent='flex-end'>
      <Grid item container direction='column'>
        {
          currentChat.messages.map((msgProps: IMessage) => {
            if (msgProps.username === user.username) {
              return <p style={{ textAlign: 'right' }} key={`${msgProps.id}`}>{msgProps.text}</p>;
            }
            return <p style={{ textAlign: 'left' }} key={`${msgProps.id}`}>{msgProps.text}</p>;
          })
        }
      </Grid>
      <div>
        <textarea rows={1} placeholder='Write message' ref={newMessageRef} />
        <button type='button' onClick={handleSendMessages}>SEND</button>
      </div>
    </Grid>
  );
};

export default MessagesContainer;
