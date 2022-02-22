import React from 'react';
import { format } from 'timeago.js';
import { Typography } from '@mui/material';
import { IMessage } from '../../config/types';
import yt from '../../utils/translator';

interface IMessageComponent{
  msgProps: IMessage;
  self: boolean;
}

const StyledTypography = (
  { children, self, innerRef }:
    { children: React.ReactNode, self: boolean, innerRef: React.MutableRefObject<HTMLParagraphElement | null>},
) => (
  <Typography
    style={{
      padding: '10px',
      borderRadius: '10px',
      backgroundColor: self ? '#eceff1' : '#1eb4ff',
      color: self ? 'black' : 'white',
      maxWidth: '300px',
    }}
    paragraph
    ref={innerRef}
  >
    {children}
  </Typography>
);

const StyledMessage = (
  {
    children,
    self,
    handleContextMenu,
  }:
    {
      children: React.ReactNode,
      self: boolean,
      // eslint-disable-next-line no-unused-vars
      handleContextMenu: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    },
) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      marginTop: '20px',
      alignItems: self ? 'flex-end' : 'flex-start',
    }}
    onContextMenu={handleContextMenu}
  >
    {children}
  </div>
);

const Message = ({ msgProps, self }: IMessageComponent) => {
  const textRef: React.MutableRefObject<HTMLParagraphElement | null> = React.useRef(null);
  const [eng, setEng] = React.useState(true); // is message in english

  const handleContextMenu = async () => {
    if (textRef.current !== null) {
      // changing the language
      setEng((b: boolean) => !b);
      // translating from en to ru (or otherwise)
      textRef.current.innerText = await yt(
        textRef.current.innerText,
        eng ? 'en' : 'ru',
        eng ? 'ru' : 'en',
      );
    }
  };

  return (
    <StyledMessage self={self} handleContextMenu={handleContextMenu}>
      <div style={{ display: 'flex' }}>
        {/*
      <img
        className='messageImg'
        src='https://images.pexels.com/photos/3686769/pexels-photo-3686769.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500'
        alt=''
      />
      */}
        <StyledTypography self={self} innerRef={textRef}>{msgProps.text}</StyledTypography>
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
};

export default Message;
