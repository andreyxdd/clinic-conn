import React from 'react';
import { useRouter } from 'next/router';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Avatar,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import useMediaQuery from '@mui/material/useMediaQuery';
import MedicationLiquidIcon from '@mui/icons-material/MedicationLiquid';
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/material/styles';
import Link from 'next/link';
import { navigationPaths } from '../config/paths';
import { IPathProps } from '../config/types';
import useAuth from '../customHooks/useAuth';

const AuthButton = styled(LoadingButton)(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  color: theme.palette.primary.main,
  width: 150,
  '&:hover': {
    background: theme.palette.primary.light,
  },
}));

interface INavbarProps{
  // openDrawer?: boolean;
  setOpenDrawer:React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar: React.FC<INavbarProps> = (
  { setOpenDrawer },
) => {
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width:600px)');
  const { user } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleOpenDrawer = () => {
    setOpenDrawer(true);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='fixed'>
        <Toolbar>
          <Link href='/home' passHref>
            <IconButton
              size='large'
              edge='start'
              color='inherit'
              aria-label='menu'
              sx={{ mr: 2 }}
            >
              <MedicationLiquidIcon />
            </IconButton>
          </Link>
          <Typography variant='h5' component='div' sx={{ flexGrow: 1 }}>
            WorldMedExpo
          </Typography>
          {!isMobile
            && (
              <>
                {
                  navigationPaths.map((item: IPathProps) => (
                    <Link key={item.title} href={item.path} passHref>
                      <Button
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        variant={router.pathname === item.path ? 'outlined' : 'inherit'}
                        color='inherit'
                        type='button'
                        style={{
                          width: 150,
                          marginRight: 30,
                        }}
                      >
                        {item.title}
                      </Button>
                    </Link>
                  ))
                }
                {!user && (
                  <Link href='/login' passHref>
                    <AuthButton
                      loading={isLoading}
                      onClick={() => {
                        setIsLoading(true);
                      }}
                      type='button'
                      variant='contained'
                    >
                      Sign In
                    </AuthButton>
                  </Link>
                )}
              </>
            )}
          {user && (
            <div style={{ paddingLeft: 5 }}>
              <Link href={`/profile/${user.username}`} passHref>
                <IconButton
                  color='inherit'
                  aria-label='user-avatar'

                >
                  <Avatar>{user.username.substring(0, 2)}</Avatar>
                </IconButton>
              </Link>
              <IconButton
                color='inherit'
                aria-label='open-drawer'
                edge='end'
                onClick={handleOpenDrawer}
              >
                <MenuIcon />
              </IconButton>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
