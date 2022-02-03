/* eslint-disable max-len */
import React from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Typography, Button, Grid } from '@mui/material';
import Layout from '../layouts/Layout';

/**
 * This is the landing page.
 * @return {JSX.Element}
 */
const Patients: NextPage = (): JSX.Element => {
  const router = useRouter();
  const [showTransition, setShowTransition] = React.useState(false);
  const handleClick = (newPath: string) => {
    setShowTransition(true);
    router.push(newPath);
  };
  return (
    <Layout showNavbar maxWidth='xl' showTransition={showTransition}>
      <Typography variant='h4' sx={{ mb: 6 }}>
        Infromation for Patients
      </Typography>
      <Typography variant='h5' sx={{ m: 5 }}>
        What we offer?
      </Typography>
      <Typography variant='body2' component='p' sx={{ m: 5 }}>
        Suspendisse consectetur, erat in rutrum luctus, ante libero auctor odio, ac tempus mauris magna vitae elit. Ut risus purus, eleifend id mauris vitae, suscipit rhoncus ante. Duis commodo semper hendrerit. Quisque iaculis eu eros a condimentum. Pellentesque elementum, ligula et fermentum ultrices, dui sapien aliquam elit, a lobortis leo purus non metus. Curabitur auctor non magna aliquam accumsan. Duis hendrerit rhoncus enim, et facilisis justo ullamcorper tempus. Mauris mauris eros, mollis sit amet lobortis eget, pretium scelerisque risus. Integer varius lectus eros, vel blandit risus condimentum eu. Etiam laoreet, sapien ut venenatis pellentesque, nisl nibh auctor dui, et elementum urna elit eget diam. Curabitur nec porta quam.Donec eu nisi id tellus convallis aliquet. Morbi auctor odio lorem, at blandit massa hendrerit sit amet. Suspendisse auctor cursus mauris ut interdum. Praesent libero elit, ullamcorper ac varius eget, porta vel augue.
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
              onClick={() => { handleClick('/register'); }}
              variant='outlined'
              type='button'
            >
              Procced to register page
            </Button>
          </Grid>
          <Grid item xs={6} container justifyContent='center'>
            <Button
              onClick={() => { handleClick('/login'); }}
              variant='outlined'
              type='button'
            >
              Procced to login page
            </Button>
          </Grid>
        </Grid>
      </div>
    </Layout>
  );
};

export default Patients;
