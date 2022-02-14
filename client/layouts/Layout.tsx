import React from 'react';
import { Breakpoint, Container } from '@mui/material';
import shallow from 'zustand/shallow';
import Navbar from '../components/Navbar';
import TransitionLoader from '../components/TransitionLoader';
import Copyright from '../components/Copyright';
import MobileDrawer from '../components/MobileDrawer';
import { useUIStore } from '../context/UIStore';

interface ILayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<ILayoutProps> = ({ children }) => {
  const [openMobileDrawer, setOpenMobileDrawer] = React.useState(false);

  const showTransition = false;

  const {
    containerMaxWidth, showNavbar,
  } = useUIStore(
    (store) => ({
      containerMaxWidth: store.containerMaxWidth,
      showNavbar: store.showNavbar,
    }),
    shallow,
  );

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
        maxWidth={containerMaxWidth as Breakpoint}
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
