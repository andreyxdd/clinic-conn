import React from 'react';
import type { NextPage } from 'next';
import { Typography, Button, Grid } from '@mui/material';
import Link from 'next/link';
import Layout from '../layouts/Layout';
import useUserRedirect from '../customHooks/useRedirect';

/**
 * This is the landing page.
 * @return {JSX.Element}
 */
const Landing: NextPage = (): JSX.Element => {
  const user = useUserRedirect({ after: 1, where: '/hospitals' });
  return (
    <Layout
      showNavbar={false}
      showTransition={false}
      maxWidth='xs'
    >
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
    </Layout>
  );
};

export default Landing;
