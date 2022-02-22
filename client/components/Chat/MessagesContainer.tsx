import {
  Grid, IconButton, TextField,
} from '@mui/material';
import React, { MutableRefObject } from 'react';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { useChat } from '../../context/ChatContext';
import useAuth from '../../customHooks/useAuth';
import { IChat, IMessage } from '../../config/types';
import events from '../../config/events';
import Message from './Message';

interface IMessagesContainer {
  xs: number
}

const MessagesContainer: React.FC<IMessagesContainer> = ({ xs }) => {
  const {
    currentChat, setCurrentChat, setChats, socket,
  } = useChat();
  const { user } = useAuth();
  const newMessageRef: MutableRefObject<HTMLTextAreaElement | null> = React.useRef(null);
  const messageEndRef: MutableRefObject<HTMLDivElement | null> = React.useRef(null);

  React.useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentChat]);

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

      // updating current chat
      setCurrentChat((currChat: IChat) => ({
        ...currChat,
        messages: [...currChat.messages, content],
      }));

      // updating chats array
      // TODO: bad. there should be a better solution
      setChats((currChats: Array<IChat>) => {
        const updatedChats = currChats.map((chat: IChat) => {
          if (chat.chatId === currentChat?.chatId) {
            return { ...chat, messages: [...chat.messages, content] };
          }
          return { ...chat };
        });
        return updatedChats;
      });

      newMessageRef.current.value = '';
    }
  };

  if (!currentChat) return <Grid item xs={xs}>Select chat to start messaging</Grid>;
  if (!user) return <Grid item xs={xs}>Sorry this content is not availble for non-users</Grid>;

  return (
    <Grid
      item
      xs={xs}
      container
      direction='column'
      justifyContent='flex-end'
      sx={{ p: 1 }}
      style={{ borderRadius: 2 }}
    >
      {/* Messages */}
      <Grid
        item
        container
        direction='column'
        sx={{ pb: 2 }}
      >
        {
          currentChat.messages.map((msgProps: IMessage) => {
            if (msgProps.username === user.username) {
              return <Message key={`${msgProps.sentAt}`} msgProps={msgProps} self />;
            }
            return <Message key={`${msgProps.sentAt}`} msgProps={msgProps} self={false} />;
          })
        }
        <div ref={messageEndRef} />
      </Grid>
      {/* Text area and buttons */}
      <Grid
        item
        container
        justifyContent='space-between'
        direction='row'
        sx={{
          pr: 1, pl: 1, pb: 3, pt: 3,
        }}
        style={{
          backgroundColor: '#fafbfc',
        }}
      >
        <Grid
          item
          xs={0.5}
          container
          justifyContent='center'
          alignItems='center'
          sx={{ pr: 1 }}
        >
          <IconButton aria-label='attach-icon-btn' size='large'>
            <AttachFileIcon />
          </IconButton>
        </Grid>
        <Grid
          item
          xs={11}
          container
          justifyContent='center'
          alignItems='center'
        >
          <TextField
            inputRef={newMessageRef}
            placeholder='Write message...'
            fullWidth
            multiline
            style={{
              backgroundColor: 'white',
            }}
          />
        </Grid>
        <Grid
          item
          xs={0.5}
          container
          justifyContent='center'
          alignItems='center'
          sx={{ pl: 1 }}
        >
          <IconButton onClick={handleSendMessages} aria-label='send-icon-btn' size='large'>
            <SendIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default MessagesContainer;
