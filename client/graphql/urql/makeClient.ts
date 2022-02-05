import {
  createClient, dedupExchange, fetchExchange,
} from 'urql';
import { cacheExchange, Cache, QueryInput } from '@urql/exchange-graphcache';
import { makeOperation } from '@urql/core';
import { authExchange } from '@urql/exchange-auth';
import jwtDecode from 'jwt-decode';
import {
  getAccessToken, setAccessToken,
} from '../../config/auth';
import { LoginMutation, UserDocument, UserQuery } from '../../generated/graphql';

/*
interface IAuthStateProps {
  token: string;
}
interface IAddAuthProps {
  authState: IAuthStateProps;
  operation: any;
}
*/

function UpdateQueryTyped<Result, Query>(
  cache: Cache,
  queryInput: QueryInput,
  result: any,
  // eslint-disable-next-line no-unused-vars
  fn: (r: Result, q: Query) => Query,
) {
  return cache.updateQuery(
    queryInput, (data) => fn(result, data as any) as any,
  );
}

// eslint-disable-next-line no-unused-vars
const makeClient = () => (
  createClient({
    url: 'http://localhost:4000/graphql',
    fetchOptions: {
      credentials: 'include',
    },
    exchanges: [
      dedupExchange,
      cacheExchange({
        updates: {
          Mutation: {
            // eslint-disable-next-line no-unused-vars
            login: (_result, args, cache, info) => {
              UpdateQueryTyped<LoginMutation, UserQuery>(
                cache,
                { query: UserDocument },
                _result,
                (r, q) => {
                  if (!r?.login) { // not authorized
                    return q;
                  }
                  return { user: r.login.user };
                },
              );
            },
          },
        },
      }),
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
        didAuthError: ({ error }) => error.graphQLErrors.some(
          (e) => e.extensions?.code === 'FORBIDDEN',
        ),
        // method to fetch auth state
        // auth state may vary with implementation
        getAuth: async ({ authState }) => {
          if (!authState) {
            // getting run-time memory access token
            const token = getAccessToken();
            if (token) {
              return { token };
            }
          }

          // fetch from the server based on the refresh
          // token set in the browser
          const refreshedData = await fetch(
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
          ).then((res) => res.json());

          if (refreshedData.ok && refreshedData.accessToken) {
            // setting access token in run-time memory
            setAccessToken(refreshedData.accessToken);
            return { token: refreshedData.accessToken };
          }

          // TODO: logout() method should be here
          // revokeRefreshtoken

          // otherwise nothing
          return null;
        },
      }),
      fetchExchange,
    ],
  })
);

export default makeClient;
