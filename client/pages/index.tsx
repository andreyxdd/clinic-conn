import React from 'react';
import type { NextPage } from 'next';
import { Typography, Button, Grid } from '@mui/material';
import Link from 'next/link';

export async function getStaticProps() {
  return {
    props: {},
  };
}

/**
 * This is the landing page.
 * @return {JSX.Element}
 */
// eslint-disable-next-line no-unused-vars
const Landing: NextPage = (props): JSX.Element => (
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
          This is a landing page
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant='body1' align='center'>
          This page helps better understand our business model. Plus, it&apos;s easily accessable for SEO.
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

export default Landing;
