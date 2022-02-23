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
import useMediaQuery from '@mui/material/useMediaQuery';
import { useSnackbar } from 'notistack';
import { IPathProps } from '../config/types';
import { navigationPaths, userPaths } from '../config/paths';
import useAuth from '../customHooks/useAuth';

interface IUserDrawerProps {
  openDrawer: boolean;
  setOpenDrawer: React.Dispatch<React.SetStateAction<boolean>>;
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

const UserDrawer: React.FC<IUserDrawerProps> = (
  { openDrawer, setOpenDrawer },
) => {
  const { logout, user } = useAuth();
  const isMobile = useMediaQuery('(max-width:600px)');
  const router = useRouter();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  const handleLogout = async () => {
    console.log('Logout!');
    const res = await logout();

    if (res.ok) {
      enqueueSnackbar(
        'You have successfully logged out',
        { variant: 'success' },
      );
      router.push('/home');
    } else {
      enqueueSnackbar(
        'You are not logged out. Something went wrong.',
        { variant: 'error' },
      );
    }
  };

  const handleNavigationClick = (newPath: string) => {
    router.push(newPath);
    setOpenDrawer(false);
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
      open={openDrawer}
    >
      <DrawerHeader>
        <IconButton onClick={() => { setOpenDrawer(false); }}>
          {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      {isMobile && (
        <>
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
        </>
      )}
      <List>
        {userPaths.map((item: IPathProps) => (
          <ListItem
            button
            key={item.title}
            disabled={!user}
            onClick={() => {
              if (item.title === 'Logout') {
                handleLogout();
                setOpenDrawer(false);
                return;
              }
              if (item.title === 'My Profile') {
                handleNavigationClick(`${item.path}/${user?.username}`);
                return;
              }

              handleNavigationClick(item.path);
            }}
          >
            <ListItemText primary={item.title} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};
export default UserDrawer;
