/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { createClient, Provider } from 'urql';
import theme from '../styles/theme';
import createEmotionCache from '../lib/createEmotionCache';
import '../styles/globals.css';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface IAppProps extends AppProps {
  // eslint-disable-next-line react/require-default-props
  emotionCache?: EmotionCache;
}

const client = createClient({
  url: 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: 'include',
  },
  fetch: (...args) => fetch(...args).then((response) => {
    const myHeader = response.headers.get('my-header');
    if (myHeader) {
      console.log('%c_app.tsx line:29 myHeader', 'color: #007acc;', myHeader);
    }

    console.log(response);

    return response;
  }),
});

const App = (props: IAppProps) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  return (
    <Provider value={client}>
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
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </CacheProvider>
    </Provider>
  );
};

export default App;
