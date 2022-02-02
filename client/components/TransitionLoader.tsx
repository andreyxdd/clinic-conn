import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

const FullScreenBox = styled(Box)(() => ({
  zIndex: 2,
  height: '100%',
  width: '100%',
  position: 'fixed',
  padding: 0,
  margin: 0,
  top: 0,
  left: 0,
  background: 'rgba(255,255,255,0.5)',
}));

const TransitionLoader = () => (
  <FullScreenBox
    component='div'
  >
    <div style={{
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
    }}
    >
      <CircularProgress size={80} />
    </div>
  </FullScreenBox>
);

export default TransitionLoader;
