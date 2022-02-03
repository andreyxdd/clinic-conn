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
import useMediaQuery from '@mui/material/useMediaQuery';
import MedicationLiquidIcon from '@mui/icons-material/MedicationLiquid';
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/material/styles';
import { navigationPaths } from '../config/paths';
import { IPathProps } from '../config/types';

const AuthButton = styled(Button)(({ theme }) => ({
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
  const userLoggedIn = false;
  const isMobile = useMediaQuery('(max-width:600px)');

  const handleNavigationClick = (
    newPath: string,
  ) => {
    router.push(newPath);
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
                  <Button
                    key={item.title}
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    variant={router.pathname === item.path ? 'outlined' : 'inherit'}
                    color='inherit'
                    onClick={() => { handleNavigationClick(item.path); }}
                    type='button'
                    style={{
                      width: 150,
                      marginRight: 30,
                    }}
                  >
                    {item.title}
                  </Button>
                ))
              }

              {userLoggedIn ? (
                <AuthButton
                  onClick={() => {}}
                  type='button'
                  variant='contained'
                >
                  Log Out
                </AuthButton>
              ) : (
                <AuthButton
                  onClick={() => { handleNavigationClick('/login'); }}
                  type='button'
                  variant='contained'
                >
                  Sign In
                </AuthButton>
              )}
            </>
          )}

        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
