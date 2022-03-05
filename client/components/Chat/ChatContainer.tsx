import React from 'react';
import {
  Grid, styled, Typography,
} from '@mui/material';
import { format } from 'timeago.js';
import { useChat } from '../../context/ChatContext';
import { IChat } from '../../config/types';
import MessagesContainer from './MessagesContainer';

interface IChatContainerProps { }

interface IChatItem{
  selected: number; unread: number;
}
const ChatItem = styled(Grid)((
  { selected, unread }: IChatItem,
) => ({
  padding: '5px',
  borderBottom: '1px solid grey',
  // eslint-disable-next-line no-nested-ternary
  backgroundColor: unread ? '#AFDBF5' : (selected ? '#E8E8E8' : ''),
  '&:hover': {
    backgroundColor: '#D3D3D3',
    cursor: 'pointer',
  },
}));

const ChatContainer: React.FC<IChatContainerProps> = () => {
  const {
    chats, setChats,
  } = useChat();

  const handleChatClick = (chatToDisplay: IChat) => {
    // updating chats array to indicate active chat
    setChats((currChats: Array<IChat>) => {
      const updatedChats = currChats.map((chat: IChat) => {
        if (chat.chatId === chatToDisplay.chatId) {
          return { ...chat, active: true };
        }
        return { ...chat, active: false };
      });
      return updatedChats;
    });
  };

  // sorting chats by last message datetime
  const sortedChats = React.useMemo(
    () => chats.sort((chatA: IChat, chatB: IChat) => {
      const [chatAlstMsg] = chatA.messages.slice(-1);
      const [chatBlstMsg] = chatB.messages.slice(-1);

      const sentAtA: Date = new Date(chatAlstMsg.sentAt);
      const sentAtB: Date = new Date(chatBlstMsg.sentAt);

      if (sentAtA.getTime() < sentAtB.getTime()) {
        return 1;
      }
      if (sentAtA.getTime() > sentAtB.getTime()) {
        return -1;
      }
      return 0;
    }),
    [chats],
  );

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
        {sortedChats.map((chat: IChat) => {
          const chatWithUsername = chat.participantUsername;
          const [lastMsg] = chat.messages.slice(-1);

          let isUnread = false;
          // msg is not from my self and it's not yet unread
          if (lastMsg.username === chatWithUsername
            && lastMsg.readAt === null
            && !chat.active
          ) {
            isUnread = true;
          }

          return (
            <ChatItem
              item
              key={chat.chatId}
              onClick={() => { handleChatClick(chat); }}
              selected={+(chat?.active || false)}
              unread={+isUnread}
            >
              <Grid
                container
                direction='row'
                justifyContent='space-between'
                alignItems='center'
              >
                <Grid item>
                  <Typography
                    variant='subtitle1'
                    sx={{ fontWeight: isUnread ? 'bold' : 'medium' }}
                  >
                    {chatWithUsername}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography
                    variant='body2'
                    sx={{
                      position: 'relative',
                      fontWeight: isUnread ? 'medium' : 'light',
                    }}

                  >
                    {format(lastMsg.sentAt)}
                  </Typography>
                </Grid>
              </Grid>
              <Typography variant='body1' noWrap sx={{ fontWeight: isUnread ? 'medium' : 'light' }}>
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
