import React from 'react';
import { Typography, Link } from '@mui/material';

interface ICopyrightProps {}

const Copyright: React.FC<ICopyrightProps> = () => (
  <Typography
    variant='body2'
    color='text.secondary'
    align='center'
    style={{
      position: 'relative',
      bottom: '20px',
      marginTop: '-20px',
      paddingTop: '20px',
    }}
  >
    {'Copyright © '}
    <Link color='inherit' href='/'>
      WorldMedExpo
    </Link>
    {' '}
    {new Date().getFullYear()}
    .
  </Typography>
);

export default Copyright;
