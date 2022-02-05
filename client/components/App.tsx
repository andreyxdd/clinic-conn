import React from 'react';
import { Typography, Container } from '@mui/material';
import Copyright from './Copyright';

const App = () => (
  <Container component='main' maxWidth='xs'>
    <div>Hello</div>
    <Typography variant='h5'>It is me</Typography>
    <Copyright />
  </Container>
);

export default App;
