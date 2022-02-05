/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { Provider as URQLProvider } from 'urql';
import theme from '../styles/theme';
import createEmotionCache from '../lib/createEmotionCache';
import '../styles/globals.css';
import makeClient from '../graphql/urql/makeClient';

// Client-side cache, shared for the whole session of the user in the browser
const clientSideEmotionCache = createEmotionCache();

interface IAppProps extends AppProps {
  // eslint-disable-next-line react/require-default-props
  emotionCache?: EmotionCache;
}

const App = (props: IAppProps) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  return (
    <URQLProvider value={makeClient()}>
      <CacheProvider value={emotionCache}>
        <Head>
          <title>Clinic-conn App</title>
          <link
            rel='icon'
            href='https://img.icons8.com/color/48/000000/diamond.png'
          />
          <meta name='viewport' content='initial-scale=1, width=device-width' />
        </Head>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </CacheProvider>
    </URQLProvider>
  );
};

export default App;
