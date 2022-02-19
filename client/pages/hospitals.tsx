/* eslint-disable max-len */
import React from 'react';
import type { NextPage } from 'next';
import { Typography, Button, Grid } from '@mui/material';
import Link from 'next/link';
import useLayout from '../customHooks/useLayout';

const Hospitals: NextPage = (): JSX.Element => {
  useLayout({ showNavbar: true, showTransition: false, containerMaxWidth: 'xl' });

  return (
    <>
      <Typography variant='h4' sx={{ mb: 6 }}>
        Infromation for Hospitals
      </Typography>
      <Typography variant='h5' sx={{ m: 5 }}>
        What we offer?
      </Typography>
      <Typography variant='body2' component='p' sx={{ m: 5 }}>
        Class aptent dui sapien aliquam elit, a lobortis leo purus non metus. Curabitur auctor non magna aliquam accumsan. Duis hendrerit rhoncus enim, et facilisis justo ullamcorper tempus. Mauris mauris eros, mollis sit amet lobortis eget, pretium scelerisque risus. Integer varius lectus eros, vel blandit risus condimentum eu. Etiam laoreet, sapien ut venenatis pellentesque, nisl nibh auctor dui, et elementum urna elit eget diam. Curabitur nec porta quam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc tempus, nisi nec pharetra pretium, dui sapien vulputate nulla, sed imperdiet sem tortor efficitur orci. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin sit amet pulvinar velit, id feugiat mi. Etiam malesuada, nisi feugiat ultricies semper, odio nisi accumsan eros, ac convallis ante lectus ac tellus.
      </Typography>
      <Typography variant='h5' sx={{ mt: 5, ml: 5 }}>
        What&apos;s next?
      </Typography>
      <Typography variant='body2' component='p' sx={{ mt: 1, ml: 5 }}>
        Choose wisely:
      </Typography>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Grid container justifyContent='space-evenly' spacing={3}>
          <Grid item xs={6} container justifyContent='center'>
            <Button
              onClick={() => {}}
              disabled
              variant='outlined'
              type='button'
            >
              Contact us for registration
            </Button>
          </Grid>
          <Grid item xs={6} container justifyContent='center'>
            <Link href='/login' passHref>
              <Button
                variant='outlined'
                type='button'
              >
                Procced to login page
              </Button>
            </Link>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default Hospitals;
