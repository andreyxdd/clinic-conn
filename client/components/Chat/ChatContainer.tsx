import React from 'react';
import {
  Grid, styled, Typography,
} from '@mui/material';
import { format } from 'timeago.js';
import { useChat } from '../../context/ChatContext';
import { IChat } from '../../config/types';
import MessagesContainer from './MessagesContainer';

interface IChatContainerProps { }

const ChatItem = styled(Grid)({
  padding: '5px',
  borderBottom: '1px solid grey',
  '&:hover': {
    backgroundColor: '#D3D3D3',
    cursor: 'pointer',
  },
});

const ChatContainer: React.FC<IChatContainerProps> = () => {
  const { chats, setCurrentChat } = useChat();

  const handleChatClick = (chatToDisplay: IChat) => {
    setCurrentChat(chatToDisplay);
  };

  return (
    <Grid
      aria-label='chat-container'
      container
      direction='row'
      alignItems='stretch'
      style={{
        height: 'calc(100vh - 160px)',
      }}
    >
      <Grid
        aria-label='chat-boxes-container'
        item
        xs={2}
        container
        direction='column'
        wrap='nowrap'
        style={{ border: '1px solid grey', borderRadius: '5px', borderRight: '0px' }}
      >
        {chats.map((chat: IChat) => {
          const chatWithUsername = chat.participantUsername;
          const [lastMsg] = chat.messages.slice(-1);
          return (
            <ChatItem
              item
              key={chat.chatId}
              onClick={() => { handleChatClick(chat); }}
            >
              <Grid
                container
                direction='row'
                justifyContent='space-between'
                alignItems='center'
              >
                <Grid item wrap='nowrap'>
                  <Typography variant='subtitle1' sx={{ fontWeight: 'medium' }}>
                    {chatWithUsername}
                  </Typography>
                </Grid>
                <Grid item wrap='nowrap'>
                  <Typography
                    variant='body2'
                    sx={{
                      position: 'relative',
                      fontWeight: 'light',
                    }}

                  >
                    {format(lastMsg.sentAt)}
                  </Typography>
                </Grid>
              </Grid>
              <Typography variant='body1' noWrap sx={{ fontWeight: 'light' }}>
                {lastMsg.text}
              </Typography>
            </ChatItem>
          );
        })}
      </Grid>
      <MessagesContainer xs={10} />
    </Grid>
  );
};

export default ChatContainer;
