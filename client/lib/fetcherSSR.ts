import axios, { AxiosResponse } from 'axios';
import { IncomingMessage, ServerResponse } from 'http';
import { getAccessToken, setAccessToken } from '../config/auth';
import env from './env';
import getError from './errors';
import { QueryResponse } from './fetcher';

const SET_COOKIE_HEADER = 'set-cookie';

const refreshTokens = async (req: IncomingMessage, res: ServerResponse) => {
  const response = await axios.post(
    `${env.serverUri}/refresh_access_token`,
    undefined, {
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
        throw getError(innerError);
      }
    }

    throw getError(error);
  }
};

export default async function fetcherSSR <T>(
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
