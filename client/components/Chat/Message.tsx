import React from 'react';
import { format } from 'timeago.js';
import {
  styled, Typography, Menu, MenuList, MenuItem,
} from '@mui/material';

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
      borderRadius: self ? '10px 10px 0 10px' : '10px 10px 10px 0',
      backgroundColor: self ? '#eceff1' : '#1eb4ff',
      color: self ? 'black' : 'white',
      maxWidth: '300px',
    }}
    paragraph
    ref={innerRef}
    component='div'
  >
    {children}
  </Typography>
);

const StyledDiv = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    cursor: 'context-menu',
  },
});

const Message = ({ msgProps, self }: IMessageComponent) => {
  const textRef: React.MutableRefObject<HTMLParagraphElement | null> = React.useRef(null);

  const [eng, setEng] = React.useState(true); // is message in english

  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);
  const open = Boolean(anchorEl);

  const handleContextMenu = async (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button === 0) {
      setAnchorEl(e.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleItemSelection = async () => {
    handleClose();

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
    <>
      <StyledDiv
        style={{
          alignItems: self ? 'flex-end' : 'flex-start',
        }}
      >
        <div
          aria-hidden='true'
          style={{ display: 'flex', marginBottom: '-12px' }}
          onMouseDown={handleContextMenu}
        >
          <StyledTypography self={self} innerRef={textRef}>
            {msgProps.text}
          </StyledTypography>
        </div>
        <Typography
          variant='body2'
          style={{
            fontSize: '10px',
            paddingBottom: '8px',
          }}
        >
          {format(msgProps.sentAt)}
        </Typography>
      </StyledDiv>
      <Menu
        id='msg-ctx-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: self ? 'left' : 'right',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <MenuList dense>
          <MenuItem onClick={handleItemSelection} disabled={!eng}>Translate to RUS</MenuItem>
          <MenuItem onClick={handleItemSelection} disabled={!!eng}>Translate to ENG</MenuItem>
        </MenuList>
      </Menu>
    </>
  );
};

export default Message;
