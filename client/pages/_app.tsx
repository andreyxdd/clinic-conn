/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
// import Router, { useRouter } from 'next/router';
import theme from '../styles/theme';
import createEmotionCache from '../lib/emotion/createEmotionCache';
import '../styles/globals.css';
import { UserProvider } from '../context/userContext';
import { IUser } from '../config/types';
import fetcher from '../lib/api/csr/fetcher';
import env from '../config/env';
import useSessionStorage from '../customHooks/useSessionStorage';

// Client-side cache, shared for the whole session of the user in the browser
const clientSideEmotionCache = createEmotionCache();
interface IAppProps extends AppProps {
  // eslint-disable-next-line react/require-default-props
  emotionCache?: EmotionCache;
  // eslint-disable-next-line react/require-default-props
  userCache?: IUser;
}

const App = (props: IAppProps) => {
  const {
    Component, emotionCache = clientSideEmotionCache, pageProps,
  } = props;

  const [user, setUser] = useSessionStorage<IUser | null>('user');

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
  }, []);

  return (
    <UserProvider initialContext={{ user, setUser }}>
      <CacheProvider value={emotionCache}>
        <Head>
          <title>WorldMedExpo</title>
          {/*
          <link
            rel='icon'
            href='https://img.icons8.com/color/48/000000/diamond.png'
          /> */}
          <meta name='viewport' content='initial-scale=1, width=device-width' />
        </Head>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </CacheProvider>
    </UserProvider>
  );
};

export default App;
