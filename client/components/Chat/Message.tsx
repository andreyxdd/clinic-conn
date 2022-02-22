import { format } from 'timeago.js';
// import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';
import { IMessage } from '../../config/types';

interface IMessageComponent{
  msgProps: IMessage;
  self: boolean;
}

const StyledTypography = (
  { children, self }:
    { children: React.ReactNode, self: boolean },
) => (
  <Typography style={{
    padding: '10px',
    borderRadius: '10px',
    backgroundColor: self ? '#eceff1' : '#1eb4ff',
    color: self ? 'black' : 'white',
    maxWidth: '300px',
  }}
  >
    {children}
  </Typography>
);

const StyledMessage = (
  { children, self }:
    { children: React.ReactNode, self: boolean },
) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    marginTop: '20px',
    alignItems: self ? 'flex-end' : 'flex-start',
  }}
  >
    {children}
  </div>
);

const Message = ({ msgProps, self }: IMessageComponent) => (
  <StyledMessage self={self}>
    <div style={{ display: 'flex' }}>
      {/*
      <img
        className='messageImg'
        src='https://images.pexels.com/photos/3686769/pexels-photo-3686769.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500'
        alt=''
      />
      */}
      <StyledTypography self={self}>{msgProps.text}</StyledTypography>
    </div>
    <div style={{
      fontSize: '12px',
      marginTop: '10px',
    }}
    >
      {format(msgProps.sentAt)}
    </div>
  </StyledMessage>
);

export default Message;
