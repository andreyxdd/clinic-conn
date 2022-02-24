import React from 'react';
import { Breakpoint, Container } from '@mui/material';
import shallow from 'zustand/shallow';
import Navbar from '../components/Navbar';
import TransitionLoader from '../components/TransitionLoader';
import Copyright from '../components/Copyright';
import UserDrawer from '../components/UserDrawer';
import { useUIStore } from '../context/UIStore';

interface ILayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<ILayoutProps> = ({ children }) => {
  const [openDrawer, setOpenDrawer] = React.useState(false);

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
          // openDrawer={openDrawer}
          setOpenDrawer={setOpenDrawer}
        />
      )}
      {showTransition && <TransitionLoader />}
      <Container
        component='main'
        maxWidth={containerMaxWidth as Breakpoint}
        onClick={() => {
          if (openDrawer) {
            setOpenDrawer(false);
          }
        }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <div style={{
          marginTop: 90,
          flexGrow: 1,
          marginBottom: 50,
        }}
        >
          {children}
        </div>
        <Copyright />
      </Container>
      <UserDrawer
        openDrawer={openDrawer}
        setOpenDrawer={setOpenDrawer}
      />
    </div>
  );
};

export default Layout;
