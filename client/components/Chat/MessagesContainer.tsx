import { Grid } from '@mui/material';
import React, { MutableRefObject } from 'react';
import { useChat } from '../../context/ChatContext';
import useAuth from '../../customHooks/useAuth';
import { IChat, IMessage } from '../../config/types';
import events from '../../config/events';

interface IMessagesContainer {
  xs: number
}

const MessagesContainer: React.FC<IMessagesContainer> = ({ xs }) => {
  const { currentChat, setCurrentChat, socket } = useChat();
  const { user } = useAuth();
  const newMessageRef: MutableRefObject<HTMLTextAreaElement | null> = React.useRef(null);

  const handleSendMessages = () => {
    if (newMessageRef.current !== null && currentChat) {
      const msgText = newMessageRef.current.value;

      // can't send white space
      if (!String(msgText).trim()) return;

      const content: IMessage = {
        username: user!.username,
        text: msgText,
        sentAt: new Date(),
      };

      if (!socket) return;

      socket!.emit(events.CLIENT.SEND_MESSAGE, {
        content,
        to: `chat-${currentChat?.chatId}`,
      });

      setCurrentChat((currChat: IChat) => ({
        ...currChat,
        messages: [...currChat.messages, content],
      }));

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
              return <p style={{ textAlign: 'right' }} key={`${msgProps.sentAt}`}>{msgProps.text}</p>;
            }
            return <p style={{ textAlign: 'left' }} key={`${msgProps.sentAt}`}>{msgProps.text}</p>;
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
