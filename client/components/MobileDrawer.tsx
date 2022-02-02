import React from 'react';
import { useRouter } from 'next/router';
import { styled, useTheme } from '@mui/material/styles';
import {
  Drawer, IconButton, Divider, List, ListItem, ListItemText, ListItemIcon,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { IPathProps } from '../config/types';
import { navigationPaths, userPaths } from '../config/paths';

interface IMobileDrawerProps {
  openMobileDrawer: boolean;
  setOpenMobileDrawer: React.Dispatch<React.SetStateAction<boolean>>;
}

const drawerWidth = 240;

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-start',
}));

const MobileDrawer: React.FC<IMobileDrawerProps> = (
  { openMobileDrawer, setOpenMobileDrawer },
) => {
  const router = useRouter();
  const userLoggedIn = false;
  const theme = useTheme();

  const handleNavigationClick = (newPath: string) => {
    router.push(newPath);
    setOpenMobileDrawer(false);
  };

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
        },
      }}
      variant='persistent'
      anchor='right'
      open={openMobileDrawer}
    >
      <DrawerHeader>
        <IconButton onClick={() => { setOpenMobileDrawer(false); }}>
          {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        {navigationPaths.map((item: IPathProps, index) => (
          <ListItem
            button
            key={item.title}
            onClick={() => { handleNavigationClick(item.path); }}
          >
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={item.title} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {userPaths.map((item : IPathProps) => (
          <ListItem
            button
            key={item.title}
            disabled={!userLoggedIn}
            onClick={() => { handleNavigationClick(item.path); }}
          >
            <ListItemText primary={item.title} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};
export default MobileDrawer;
