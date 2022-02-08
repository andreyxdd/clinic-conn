import axios, { AxiosResponse } from 'axios';
import { IncomingMessage, ServerResponse } from 'http';
import { getAccessToken, setAccessToken } from '../../../config/auth';
import env from '../../../config/env';
import { handleError } from '../index';
import { QueryResponse } from '../../../config/types';

const SET_COOKIE_HEADER = 'set-cookie';

const refreshTokensSSR = async (req: IncomingMessage, res: ServerResponse) => {
  const response = await axios.post(
    `${env.api}/refresh_access_token`,
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

const handleRequestSSR = async (
  req: IncomingMessage,
  res: ServerResponse,
  request: () => Promise<AxiosResponse>,
) => {
  try {
    return await request();
  } catch (error: any) {
    if (error?.response?.status === 401) {
      try {
        await refreshTokensSSR(req, res);
        return await request();
      } catch (innerError: any) {
        throw handleError(innerError);
      }
    }

    throw handleError(error);
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
    const { data } = await handleRequestSSR(req, res, request);

    return { error: null, data };
  } catch (error: any) {
    return { error, data: null };
  }
}
