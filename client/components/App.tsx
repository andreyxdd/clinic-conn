import React from 'react';
import { Typography, Container } from '@mui/material';
import AppcontextProvider from '../context/AppContextProvider';
import Copyright from './Copyright';

const App = () => (
  <AppcontextProvider>
    <Container component='main' maxWidth='xs'>
      <div>Hello</div>
      <Typography variant='h5'>It is me</Typography>
      <Copyright />
    </Container>
  </AppcontextProvider>
);

export default App;
