import React from 'react';
import { Breakpoint, Container } from '@mui/material';
import Navbar from '../components/Navbar';
import TransitionLoader from '../components/TransitionLoader';
import Copyright from '../components/Copyright';
import MobileDrawer from '../components/MobileDrawer';

interface ILayoutProps {
  children: React.ReactNode;
  showNavbar: boolean;
  showTransition: boolean;
  maxWidth: string;
}

const Layout: React.FC<ILayoutProps> = ({
  children,
  showNavbar,
  showTransition,
  maxWidth,
}) => {
  const [openMobileDrawer, setOpenMobileDrawer] = React.useState(false);

  return (
    <div>
      {showNavbar && (
        <Navbar
          openMobileDrawer={openMobileDrawer}
          setOpenMobileDrawer={setOpenMobileDrawer}
        />
      )}
      {showTransition && <TransitionLoader />}
      <Container
        component='main'
        maxWidth={maxWidth as Breakpoint}
        onClick={() => {
          if (openMobileDrawer) {
            setOpenMobileDrawer(false);
          }
        }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <div style={{
          marginTop: 100,
          marginBottom: 20,
          flexGrow: 1,
        }}
        >
          {children}
        </div>
        <Copyright />
      </Container>
      <MobileDrawer
        openMobileDrawer={openMobileDrawer}
        setOpenMobileDrawer={setOpenMobileDrawer}
      />
    </div>
  );
};

export default Layout;
