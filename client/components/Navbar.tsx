import React from 'react';
import { useRouter } from 'next/router';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import useMediaQuery from '@mui/material/useMediaQuery';
import MedicationLiquidIcon from '@mui/icons-material/MedicationLiquid';
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/material/styles';
import shallow from 'zustand/shallow';
import Link from 'next/link';
import { navigationPaths } from '../config/paths';
import { IPathProps } from '../config/types';
import { useStore } from '../context/storeZustand';
// import { IPathProps, IUser } from '../config/types';
import env from '../config/env';
import { setAccessToken } from '../config/auth';
import poster from '../lib/api/csr/poster';

const AuthButton = styled(LoadingButton)(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  color: theme.palette.primary.main,
  width: 150,
  '&:hover': {
    background: theme.palette.primary.light,
  },
}));

interface INavbarProps{
  openMobileDrawer: boolean;
  setOpenMobileDrawer:React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar: React.FC<INavbarProps> = (
  { openMobileDrawer, setOpenMobileDrawer },
) => {
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width:600px)');
  const {
    user, setUser,
  } = useStore(
    (store) => ({
      user: store.user,
      setUser: store.setUser,
    }),
    shallow,
  );

  const [isLoading, setIsLoading] = React.useState(false);

  const handleLogout = async () => {
    console.log('Logout!');
    await poster(`${env.api}/auth/logout`);
    setAccessToken('');
    setUser(null);
    router.push('/home');
  };

  const handleOpenDrawer = () => {
    setOpenMobileDrawer(true);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='fixed'>
        <Toolbar>
          <IconButton
            size='large'
            edge='start'
            color='inherit'
            aria-label='menu'
            sx={{ mr: 2 }}
          >
            <MedicationLiquidIcon />
          </IconButton>
          <Typography variant='h5' component='div' sx={{ flexGrow: 1 }}>
            WorldMedExpo
            {user && <div>{user.username}</div>}
          </Typography>
          {isMobile ? (
            <IconButton
              color='inherit'
              aria-label='open drawer'
              edge='end'
              onClick={handleOpenDrawer}
              sx={{ ...(openMobileDrawer && { display: 'none' }) }}
            >
              <MenuIcon />
            </IconButton>
          ) : (
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
              {user ? (
                <AuthButton
                  loading={isLoading}
                  onClick={handleLogout}
                  type='button'
                  variant='contained'
                >
                  Log Out
                </AuthButton>
              ) : (
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

        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
