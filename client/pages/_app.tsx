/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import NextNprogress from 'nextjs-progressbar';
import theme from '../styles/theme';
import createEmotionCache from '../lib/emotion/createEmotionCache';
import '../styles/globals.css';
import { useCreateUIStore, UIProvider } from '../context/UIStore';
import { useCreateAuthStore, AuthProvider } from '../context/AuthStore';
import ChatProvider from '../context/ChatContext';
import Layout from '../layouts/Layout';

// Client-side cache, shared for the whole session of the user in the browser
const clientSideEmotionCache = createEmotionCache();
interface IAppProps extends AppProps {
  // eslint-disable-next-line react/require-default-props
  emotionCache?: EmotionCache;
}

const App = (props: IAppProps) => {
  const {
    Component, emotionCache = clientSideEmotionCache, pageProps,
  } = props;

  const createStore = useCreateUIStore(pageProps?.initialZustandState);
  const createAuthStore = useCreateAuthStore(pageProps?.initialZustandState);

  // Provider is for common UI states (Zustand)
  // AuthProvider is for user state (Zustand)
  // ChatProvider to manage chat sockets (Context API)
  return (
    <UIProvider createStore={createStore}>
      <AuthProvider createStore={createAuthStore}>
        <ChatProvider>
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
                <NextNprogress color='white' options={{ easing: 'ease', speed: 500 }} />
                <Component {...pageProps} />
              </Layout>
            </ThemeProvider>
          </CacheProvider>
        </ChatProvider>
      </AuthProvider>
    </UIProvider>
  );
};

export default App;
