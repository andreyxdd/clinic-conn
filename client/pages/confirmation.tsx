import React from 'react';
import type { NextPage } from 'next';
import { Typography, Button, Grid } from '@mui/material';
import Link from 'next/link';
import useRedirect from '../customHooks/useRedirect';
import useLayout from '../customHooks/useLayout';
import ClientOnlyDiv from '../components/ClientOnlyDiv';

/**
 * This is the landing page.
 * @return {JSX.Element}
 */
const Landing: NextPage = (): JSX.Element => {
  useLayout();
  const isUser = useRedirect({ after: 6, where: '/home', whom: 'user' });

  return (
    <ClientOnlyDiv>
      <Grid
        container
        spacing={3}
        alignItems='center'
        justifyContent='center'
        direction='column'
      >
        {isUser ? (
          <Grid item>
            <Typography variant='h4' align='center'>
              Sorry, this page is not availble to you. In a few secs you will be redirected to Home page
            </Typography>
          </Grid>
        )
          : (
            <>
              <Grid
                item
                sx={{ mt: 5, mb: 5 }}
              >
                <Typography variant='h4' align='center'>
                  Congrats! You successfully registered in our system
                </Typography>
              </Grid>
              <Grid
                item
              >
                <Typography variant='h5' align='center'>
                  To continue please follow the instructions we mailed you.
                </Typography>
              </Grid>
              <Grid item sx={{ mb: 5 }}>
                <Link href='/home' passHref>
                  <Button
                    variant='contained'
                    type='button'
                    size='large'
                  >
                    To Home Page
                  </Button>
                </Link>
              </Grid>
              <Grid item>
                <Typography variant='h5' align='center'>
                  If you didn&apos;t recieve our email, we can resend it:
                </Typography>
              </Grid>
              <Grid item>
                <Link href='/reconfirmation' passHref>
                  <Button
                    variant='contained'
                    type='button'
                    size='large'
                  >
                    Resend confirmation link
                  </Button>
                </Link>
              </Grid>
            </>
          )}

      </Grid>
    </ClientOnlyDiv>
  );
};

export default Landing;
