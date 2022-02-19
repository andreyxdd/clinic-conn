/* eslint-disable max-len */
import React from 'react';
import type { NextPage } from 'next';
import {
  Typography, Grid, Button,
} from '@mui/material';
import Link from 'next/link';
import useRedirect from '../customHooks/useRedirect';
import useLayout from '../customHooks/useLayout';
import ClientOnlyDiv from '../components/ClientOnlyDiv';

const UnsuccessfulConfirmation: NextPage = (): JSX.Element => {
  useLayout();
  const isUser = useRedirect({ after: 6, where: '/home', whom: 'user' });

  return (
    <ClientOnlyDiv>
      {isUser ? (
        <Typography variant='h4' align='center'>
          Sorry, this page is not availble to you. In a few secs you will be redirected to the Home page
        </Typography>
      )
        : (
          <Grid
            container
            spacing={3}
            alignItems='center'
            justifyContent='center'
            direction='column'
          >
            <Grid
              item
              sx={{ mt: 5, mb: 5 }}
            >
              <Typography variant='h4' align='center'>
                Invalid Confirmation Link
              </Typography>
            </Grid>
            <Grid
              item
            >
              <Typography variant='h5' align='center'>
                Sorry, you confirmation link is no longer valid. To confirm your account please request resending the confirmation link. Click below:
              </Typography>
            </Grid>
            <Grid item sx={{ mb: 5 }}>
              <Link href='/reconfirmation' passHref>
                <Button
                  variant='contained'
                  type='button'
                  size='large'
                >
                  Resend Confirmation
                </Button>
              </Link>
            </Grid>
          </Grid>
        )}
    </ClientOnlyDiv>
  );
};

export default UnsuccessfulConfirmation;
