/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import {
  createClient, Provider, dedupExchange, cacheExchange, fetchExchange,
} from 'urql';
import { makeOperation } from '@urql/core';
import { authExchange } from '@urql/exchange-auth';
import jwtDecode from 'jwt-decode';
import theme from '../styles/theme';
import createEmotionCache from '../lib/createEmotionCache';
import '../styles/globals.css';

import { getAccessToken, setAccessToken } from '../config/auth';

// Client-side cache, shared for the whole session of the user in the browser
const clientSideEmotionCache = createEmotionCache();

interface IAppProps extends AppProps {
  // eslint-disable-next-line react/require-default-props
  emotionCache?: EmotionCache;
}

/*
interface IAuthStateProps {
  token: string;
}
interface IAddAuthProps {
  authState: IAuthStateProps;
  operation: any;
}
*/

const client = createClient({
  url: 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: 'include',
  },
  exchanges: [
    dedupExchange,
    cacheExchange,
    authExchange({
      // method that runs at every operation
      // it's like middleware for the request
      addAuthToOperation: ({
        authState,
        operation,
      }) => {
        // the token isn't in the auth state, return the operation without changes
        // @ts-ignore
        if (!authState || !authState.token) {
          return operation;
        }

        // fetchOptions can be a function but you can simplify this based on usage
        const fetchOptions = typeof operation.context.fetchOptions === 'function'
          ? operation.context.fetchOptions()
          : operation.context.fetchOptions || {};

        // returning operations with auth header based on token
        return makeOperation(
          operation.kind,
          operation,
          {
            ...operation.context,
            fetchOptions: {
              ...fetchOptions,
              headers: {
                ...fetchOptions.headers,
                // @ts-ignore
                Authorization: `bearer ${authState.token}`,
              },
            },
          },
        );
      },
      // check for expiration, existence of auth, .etc
      willAuthError: ({ authState }) => {
        console.log('willAuthError');

        if (!authState) return true;

        try {
          // @ts-ignore
          const decoded: any = jwtDecode(authState.token);
          if (Date.now() >= decoded.exp * 1000) {
            return true;
          }
          return false;
        } catch {
          return true;
        }
      },
      // check if the error was an auth error
      // consider more thorough implementation
      didAuthError: ({ error }) => {
        console.log('didAuthError');

        return error.graphQLErrors.some(
          (e) => e.extensions?.code === 'FORBIDDEN',
        );
      },
      // method to fetch auth state
      // auth state may vary with implementation
      getAuth: async ({ authState }) => {
        if (!authState) {
          // getting run-time memory access token
          const token = getAccessToken();
          if (token) {
            return { token };
          }

          // if there is no token, try to fetch
          // from the server based on the refresh token
          // set in the browser
          const refreshData = await fetch(
            'http://localhost:4000/refresh_token',
            {
              method: 'POST',
              credentials: 'include',
              redirect: 'follow',
              headers: {
                'Content-Type': 'application/json',
                // eslint-disable-next-line quote-props
                'Accept': 'application/json',
              },
            },
          )
            .then((res) => res.json());

          if (refreshData.ok && refreshData.accessToken) {
            // setting access token in run-time memory
            setAccessToken(refreshData.accessToken);

            // and passing token to the authState
            return {
              token: refreshData.accessToken,
            };
          }
        }

        // TODO: logout() method should be here

        // otherwise nothing
        return null;
      },
    }),
    fetchExchange,
  ],
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
