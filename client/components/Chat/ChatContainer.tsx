import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import { useChat } from '../../context/ChatContext';
import { IChat } from '../../config/types';
import MessagesContainer from './MessagesContainer';

interface IChatContainerProps { }

const ChatContainer: React.FC<IChatContainerProps> = () => {
  const { chats, setCurrentChat } = useChat();

  const handleChatClick = (chatToDisplay: IChat) => {
    setCurrentChat(chatToDisplay);
  };

  return (
    <Grid
      container
      direction='row'
      height='100%'
    >
      <Grid
        item
        xs={3}
        container
        direction='column'
        spacing={3}
        style={{
          borderRight: '2px solid red',
        }}
      >
        {chats.map((chat: IChat) => {
          const chatWithUsername = chat.participantUsername;
          return (
            <Grid
              item
              key={chat.chatId}
              style={{
                border: '1px solid blue',
              }}
            >
              <Paper
                onClick={() => { handleChatClick(chat); }}
              >
                <Typography variant='subtitle1'>
                  Chat with:
                  {' '}
                  {chatWithUsername}
                </Typography>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
      <MessagesContainer xs={9} />
    </Grid>
  );
};

export default ChatContainer;
