import {
  Grid, IconButton, styled, TextField, Typography, Chip,
} from '@mui/material';
import React, { MutableRefObject } from 'react';
import SendIcon from '@mui/icons-material/Send';
import TranslateIcon from '@mui/icons-material/Translate';
import CallIcon from '@mui/icons-material/Call';
import useInView from 'react-cool-inview';
import { useChat } from '../../context/ChatContext';
import useAuth from '../../customHooks/useAuth';
import { IChat, IMessage } from '../../config/types';
import events from '../../config/events';
import Message from './Message';
import yt from '../../utils/translator';
import AttachmentMenuBtn from './AttachmentMenuBtn';
import VideoCallModal from './VideoCallModal';

interface IMessagesContainer {
  xs: number
}

const StyledMessagesGridContainer = styled(Grid)({
  overflowY: 'auto',
  height: 'calc(100vh - 320px)',
  paddingBottom: 6,
  paddingRight: 6,
  scrollbarWidth: 'thin',
  scrollbarColor: '#888888 #B0B0B0',
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
    setChats, socket, setOpenVideoCallModal, chats,
  } = useChat();
  const { user } = useAuth();
  const newMessageRef: MutableRefObject<HTMLTextAreaElement | null> = React.useRef(null);
  const messageEndRef = React.useRef<HTMLDivElement>(null);
  const [activeChat, setActiveChat] = React.useState<IChat | null>(null);

  React.useEffect(() => {
    const oneActiveChat = chats.find((c) => c.active);
    if (oneActiveChat) {
      setActiveChat(oneActiveChat);
      messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chats]);

  // check if the last msg is in viewport
  const { observe } = useInView({
    threshold: 0.25, // Default is 0
    onEnter: () => {
      // Triggered when the target enters the viewport
      if (activeChat) {
        const chatWithUsername = activeChat.participantUsername;
        const [lastMsg] = activeChat.messages.slice(-1);

        // msg is not from my self and it's not yet unread
        if (lastMsg.username === chatWithUsername && lastMsg.readAt === null
        ) {
          setChats((currChats: Array<IChat>) => {
            const updatedChats = currChats.map((chat: IChat) => {
              if (chat.chatId === activeChat.chatId) {
                const readAt = new Date();
                socket.emit(
                  events.CLIENT.READ_MESSAGE,
                  { msgId: lastMsg.id, readAt },
                );

                const newChatMessages = [...chat.messages];

                newChatMessages[newChatMessages.length - 1] = {
                  ...newChatMessages[newChatMessages.length - 1],
                  readAt,
                };

                return { ...chat, active: true, messages: newChatMessages };
              }
              return { ...chat };
            });
            return updatedChats;
          });
        }
      }
    },
  });

  const handleTranslate = async () => {
    if (newMessageRef.current !== null && activeChat) {
      const msgText = newMessageRef.current.value;

      // can't translate white space
      if (!String(msgText).trim()) return;

      // translating the text in the input field
      newMessageRef.current.value = await yt(msgText, 'en', 'ru');
    }
  };

  const handleSendMessages = () => {
    if (newMessageRef.current !== null && activeChat) {
      const msgText = newMessageRef.current.value;

      // can't send white space
      if (!String(msgText).trim()) return;

      const content: IMessage = {
        username: user!.username,
        text: msgText,
        sentAt: new Date(),
        readAt: null,
      };

      if (!socket) return;

      socket!.emit(events.CLIENT.SEND_MESSAGE, {
        content,
        chatId: activeChat?.chatId,
      });

      // updating chats array
      setChats((currChats: Array<IChat>) => {
        const updatedChats = currChats.map((chat: IChat) => {
          if (chat.chatId === activeChat?.chatId) {
            return { ...chat, messages: [...chat.messages, content] };
          }
          return { ...chat };
        });
        return updatedChats;
      });

      newMessageRef.current.value = '';
    }
  };

  // -- video call interface
  const handleVideoModalOpened = () => {
    setOpenVideoCallModal(true);
  };
  // --

  if (!activeChat) {
    return (
      <Grid
        item
        container
        wrap='nowrap'
        justifyContent='center'
        alignItems='center'
        xs={xs}
        sx={{ p: 0.5 }}
        style={{ border: '1px solid grey', borderRadius: '5px' }}
      >
        <Typography variant='h5'>
          Select chat on the left to start messaging
        </Typography>
      </Grid>
    );
  }
  if (!user) {
    return (
      <Grid
        item
        container
        wrap='nowrap'
        justifyContent='center'
        alignItems='center'
        xs={xs}
        sx={{ p: 0.5 }}
        style={{ border: '1px solid grey', borderRadius: '5px' }}
      >
        <Typography variant='h5'>
          Sorry this content is not availble for non-users
        </Typography>
      </Grid>
    );
  }

  return (
    <>
      <VideoCallModal />
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
              {activeChat.participantUsername}
            </Typography>
          </Grid>
          <Grid item sx={{ pl: 5 }}>
            <Chip
              icon={<CallIcon />}
              label='Initiate Call'
              onClick={handleVideoModalOpened}
            />
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
            activeChat.messages.slice().reverse().map(
              (msgProps: IMessage, idx: number) => {
                if (msgProps.username === user.username) {
                  return (
                    <Message
                      key={`${msgProps.sentAt}`}
                      msgProps={msgProps}
                      self
                    />
                  );
                }
                return (
                  <div key={`${msgProps.sentAt}`}>
                    {idx === 0 && <div id='last-message' ref={observe} />}
                    <Message
                      msgProps={msgProps}
                      self={false}
                    />
                  </div>
                );
              },
            )
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
    </>
  );
};

export default MessagesContainer;
