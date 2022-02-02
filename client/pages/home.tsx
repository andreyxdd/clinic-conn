import React from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Typography, Button } from '@mui/material';

/**
 * This is the landing page.
 * @return {JSX.Element}
 */
const Home: NextPage = (): JSX.Element => {
  const router = useRouter();
  const handleClick = () => {
    router.push('/register');
  };
  return (
    <div>
      <Typography variant='h4'>
        This is a home page
      </Typography>
      <Button onClick={handleClick} variant='outlined' type='button'>
        Procced to register page
      </Button>
    </div>
  );
};

export default Home;
