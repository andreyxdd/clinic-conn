/* eslint-disable max-len */
import React from 'react';
import type { NextPage } from 'next';
import { Typography } from '@mui/material';
import shallow from 'zustand/shallow';
import { useStore } from '../context/storeZustand';
import { IUser } from '../config/types';
import fetcher from '../lib/api/csr/fetcher';
import env from '../config/env';

interface IHomePageProps { }

/**
 * This is the landing page.
 * @return {JSX.Element}
 */
const Home: NextPage<IHomePageProps> = (): JSX.Element => {
  const {
    user, setUser, setContainerMaxWidth, setShowNavbar,
  } = useStore(
    (store) => ({
      user: store.user,
      setUser: store.setUser,
      setContainerMaxWidth: store.setContainerMaxWidth,
      setShowNavbar: store.setShowNavbar,
    }),
    shallow,
  );

  React.useEffect(() => {
    const getUser = async () => {
      const { error, data } = await fetcher<IUser>(`${env.api}/user/get`);
      if (!error && data) {
        console.log('before set user', user);
        setUser(data);
        console.log('after set user', user);
      } else {
        setUser(null);
      }
    };

    if (!user) getUser();

    setContainerMaxWidth('xl');
    setShowNavbar(true);
  }, []);

  return (
    <>
      <Typography variant='h4' sx={{ mb: 6 }}>
        This is a home page
      </Typography>
      <Typography variant='h5'>
        What are we?
      </Typography>
      <Typography variant='body2' component='p' sx={{ m: 5 }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc tempus, nisi nec pharetra pretium, dui sapien vulputate nulla, sed imperdiet sem tortor efficitur orci. Nullam rutrum eget mauris nec commodo. Interdum et malesuada fames ac ante ipsum primis in faucibus. Sed non ipsum in mauris lacinia fringilla. Donec eu nisi id tellus convallis aliquet. Morbi auctor odio lorem, at blandit massa hendrerit sit amet. Suspendisse auctor cursus mauris ut interdum. Praesent libero elit, ullamcorper ac varius eget, porta vel augue.
      </Typography>
      <Typography variant='h5'>
        What are our goals?
      </Typography>
      <Typography variant='body2' component='p' sx={{ m: 5 }}>
        Donec porta finibus convallis. Nam elementum eros quis ante vehicula, at aliquam eros malesuada. Morbi cursus dui ut erat sagittis, id sodales elit luctus. Cras sagittis dolor nec dui imperdiet, quis suscipit enim bibendum. Phasellus vehicula malesuada rhoncus. Vivamus ac diam et diam consequat interdum ut nec erat. Vestibulum in tempor nisl. Praesent id imperdiet odio. Proin non viverra quam, non hendrerit elit. Nulla imperdiet mi dolor. Fusce dignissim, arcu vitae blandit iaculis, magna tortor sodales mi, laoreet cursus est odio vel sapien. Fusce pulvinar efficitur faucibus. Maecenas egestas sollicitudin arcu ut iaculis. Nunc ullamcorper dapibus lacus, eu sodales eros mattis eu.
      </Typography>
    </>
  );
};
export default Home;
