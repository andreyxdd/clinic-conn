import React from 'react';
import { Typography } from '@mui/material';
import AppcontextProvider from '../context/AppContextProvider';

const App = () => (
  <AppcontextProvider>
    <div>Hello</div>
    <Typography variant='h5'>It is me</Typography>
  </AppcontextProvider>
);

export default App;
