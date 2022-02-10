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
import { useCreateStore, Provider } from '../context/storeZustand';
import Layout from '../layouts/Layout';
/*
import { UserProvider } from '../context/userContext';
import { IUser } from '../config/types';
import fetcher from '../lib/api/csr/fetcher';
import env from '../config/env';
import useSessionStorage from '../customHooks/useSessionStorage';
*/

// Client-side cache, shared for the whole session of the user in the browser
const clientSideEmotionCache = createEmotionCache();
interface IAppProps extends AppProps {
  // eslint-disable-next-line react/require-default-props
  emotionCache?: EmotionCache;
  // eslint-disable-next-line react/require-default-props
  // userCache?: IUser;
}

const App = (props: IAppProps) => {
  const {
    Component, emotionCache = clientSideEmotionCache, pageProps,
  } = props;

  const createStore = useCreateStore(pageProps?.initialZustandState);

  return (
    <Provider createStore={createStore}>
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
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ThemeProvider>
      </CacheProvider>
    </Provider>
  );
};

export default App;
