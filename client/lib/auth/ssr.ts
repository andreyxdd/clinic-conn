/*
 * Methods to handle get requests that require token
 * validation when page is server-side rendered (SSR).
 */
import axios, { AxiosResponse } from 'axios';
import { IncomingMessage, ServerResponse } from 'http';
import { getAccessToken, setAccessToken } from '../../config/auth';
import env from '../../config/env';
import { handleError } from './index';
import { QueryResponse } from '../../config/types';

export const SET_COOKIE_HEADER = 'set-cookie';

/*
 * Refresh access (inrun time memory) and refrestoken (in browser cookeis)
 */
const refreshTokens = async (req: IncomingMessage, res: ServerResponse) => {
  const response = await axios.get(
    `${env.api}/auth/refresh_tokens`,
    {
      headers: { cookie: String(req.headers.cookie) },
    },
  );

  const cookies = response.headers[SET_COOKIE_HEADER];
  setAccessToken(response.data.accessToken);

  if (cookies) {
    // setting cookie in the storage
    res.setHeader(SET_COOKIE_HEADER, cookies);
  }
};

/*
 * Method to handle any request that requires authorization.
 * If original request returns '401' error, this functions will first
 * try to refresh tokens and only then make second request
 */
const handleRequest = async (
  req: IncomingMessage,
  res: ServerResponse,
  request: () => Promise<AxiosResponse>,
) => {
  try {
    return await request();
  } catch (error: any) {
    if (error?.response?.status === 401) {
      try {
        await refreshTokens(req, res);
        return await request();
      } catch (innerError: any) {
        throw handleError(innerError);
      }
    }

    throw handleError(error);
  }
};

/*
 * Fetch data that is only available for authorized users
 */
export async function fetcher <T>(
  req: IncomingMessage,
  res: ServerResponse,
  uri: string,
): Promise<QueryResponse<T>> {
  try {
    const request = () => axios.get(
      uri,
      { headers: { authorization: `bearer ${getAccessToken()}` } },
    );
    const { data } = await handleRequest(req, res, request);

    return { error: null, data };
  } catch (error: any) {
    return { error, data: null };
  }
}
