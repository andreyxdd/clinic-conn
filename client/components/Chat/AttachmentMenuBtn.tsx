import React from 'react';
import { Menu, MenuItem, IconButton } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';

interface IAttachmentMenuBtnProps {}

const AttachmentMenuBtn: React.FC<IAttachmentMenuBtnProps> = () => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <IconButton
        aria-label='attach-icon-btn'
        size='large'
        onClick={handleClick}
        type='button'
      >
        <AttachFileIcon />
      </IconButton>
      <Menu
        id='attachment-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <MenuItem onClick={handleClose}>Image</MenuItem>
        <MenuItem onClick={handleClose}>File</MenuItem>
      </Menu>
    </>
  );
};

export default AttachmentMenuBtn;
