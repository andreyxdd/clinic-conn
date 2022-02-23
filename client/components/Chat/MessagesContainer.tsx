import {
  Grid, IconButton, styled, TextField, Typography,
} from '@mui/material';
import React, { MutableRefObject } from 'react';
import SendIcon from '@mui/icons-material/Send';
import TranslateIcon from '@mui/icons-material/Translate';
import CallIcon from '@mui/icons-material/Call';
import { useChat } from '../../context/ChatContext';
import useAuth from '../../customHooks/useAuth';
import { IChat, IMessage } from '../../config/types';
import events from '../../config/events';
import Message from './Message';
import yt from '../../utils/translator';
import AttachmentMenuBtn from './AttachmentMenuBtn';

interface IMessagesContainer {
  xs: number
}

const StyledMessagesGridContainer = styled(Grid)({
  overflowY: 'auto',
  height: 'calc(100vh - 320px)',
  paddingBottom: 6,
  paddingRight: 6,
  '&::-webkit-scrollbar': {
    width: '0.4vw',
    border: '4px solid transparent',
    borderRadius: '8px',
    backgroundClip: 'padding-box',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#B0B0B0',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    backgroundColor: '#888888',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: '#D3D3D3',
  },
});

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

  const handleTranslate = async () => {
    if (newMessageRef.current !== null && currentChat) {
      const msgText = newMessageRef.current.value;

      // can't translate white space
      if (!String(msgText).trim()) return;

      // translating the text in the input field
      newMessageRef.current.value = await yt(msgText, 'en', 'ru');
    }
  };

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
        chatId: currentChat?.chatId,
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
      wrap='nowrap'
      justifyContent='flex-end'
      sx={{ p: 0.5 }}
      style={{ border: '1px solid grey', borderRadius: '5px' }}
    >
      {/* Top bar */}
      <Grid
        item
        container
        justifyContent='center'
        alignItems='center'
        direction='row'
        sx={{ pt: 1, pb: 1 }}
        style={{
          backgroundColor: '#fafbfc',
          borderBottom: '0.5px solid #909090',
          zIndex: 1,
        }}
      >
        <Grid item sx={{ pr: 5 }}>
          <Typography
            variant='subtitle1'
            sx={{ fontWeight: 'medium', fontSize: 'h6.fontSize' }}
          >
            {currentChat.participantUsername}
          </Typography>
        </Grid>
        <Grid item sx={{ pl: 5 }}>
          <IconButton aria-label='call-button' size='large'>
            <CallIcon />
          </IconButton>
        </Grid>
      </Grid>
      {/* Messages */}
      <StyledMessagesGridContainer
        item
        container
        direction='column-reverse'
        wrap='nowrap'
      >
        <div ref={messageEndRef} />
        {
          currentChat.messages.slice().reverse().map((msgProps: IMessage) => {
            if (msgProps.username === user.username) {
              return <Message key={`${msgProps.sentAt}`} msgProps={msgProps} self />;
            }
            return <Message key={`${msgProps.sentAt}`} msgProps={msgProps} self={false} />;
          })
        }
      </StyledMessagesGridContainer>
      {/* Text area and buttons */}
      <Grid
        item
        container
        justifyContent='space-evenly'
        direction='row'
        sx={{
          pb: 10, pt: 3,
        }}
        style={{
          backgroundColor: '#fafbfc',
          height: '80px',
          borderTop: '0.5px solid #909090',
          zIndex: 1,
        }}
      >
        <Grid
          item
          xs={0.5}
          container
          justifyContent='center'
          alignItems='center'
        >
          <AttachmentMenuBtn />
        </Grid>
        <Grid
          item
          xs={0.5}
          container
          justifyContent='center'
          alignItems='center'
        >
          <IconButton onClick={handleTranslate} aria-label='translate-icon-btn' size='large'>
            <TranslateIcon />
          </IconButton>
        </Grid>
        <Grid
          item
          xs={9.5}
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
            maxRows={5}
          />
        </Grid>
        <Grid
          item
          xs={0.5}
          container
          justifyContent='center'
          alignItems='center'
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
