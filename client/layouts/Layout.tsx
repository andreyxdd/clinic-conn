import React from 'react';
import { Container } from '@mui/material';
import Copyright from '../components/Copyright';

interface ILayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<ILayoutProps> = ({ children }) => (
  <Container component='main' maxWidth='xs'>
    {children}
    <Copyright />
  </Container>
);

export default Layout;
