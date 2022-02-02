import React from 'react';
import { Typography, Link } from '@mui/material';

interface ICopyrightProps {}

const Copyright: React.FC<ICopyrightProps> = () => (
  <Typography
    variant='body2'
    color='text.secondary'
    align='center'
    sx={{ mt: 5 }}
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
