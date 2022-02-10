import React from 'react';
import type { NextPage } from 'next';
import { Typography, Button, Grid } from '@mui/material';
import Link from 'next/link';
import useUserRedirect from '../customHooks/useUserRedirect';
import useNoLayoutPage from '../customHooks/useNoLayoutPage';

/**
 * This is the landing page.
 * @return {JSX.Element}
 */
const Landing: NextPage = (): JSX.Element => {
  const user = useUserRedirect({ after: 1, where: '/hospitals' });
  useNoLayoutPage();

  return (
    <>
      <Grid
        container
        spacing={2}
        alignItems='center'
        justifyContent='center'
        direction='column'
      >
        <Grid item>
          <Typography variant='h4'>
            This is a confimation page -
            {' '}
            {user}
          </Typography>
        </Grid>

        <Grid item>
          <Link href='/home' passHref>
            <Button
              variant='contained'
              type='button'
              size='large'
            >
              Procced to home page
            </Button>
          </Link>
        </Grid>
      </Grid>
    </>
  );
};

export default Landing;
