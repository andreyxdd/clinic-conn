import axios, { AxiosResponse } from 'axios';
import { getAccessToken, setAccessToken } from '../config/auth';
import environment from './env';
import getError from './errors';

export type QueryResponse<T> = { error: string | null, data: T | null }

export const refreshTokens = async () => {
  const response = await axios.post(
    `${environment.serverUri}/refresh_access_token`,
    undefined,
    { withCredentials: true },
  );

  setAccessToken(response.data.accessToken);
};

const handleRequest = async (request: () => Promise<AxiosResponse>): Promise<AxiosResponse> => {
  try {
    return await request();
  } catch (error: any) {
    if (error?.response?.status === 401) {
      try {
        await refreshTokens();
        return await request();
      } catch (innerError: any) {
        throw getError(innerError);
      }
    }

    throw getError(error);
  }
};

async function fetcher<T>(uri: string): Promise<QueryResponse<T>> {
  try {
    const request = () => (
      axios.get(uri,
        {
          withCredentials: true,
          headers: { authorization: `bearer ${getAccessToken()}` },
        })
    );
    const { data } = await handleRequest(request);
    return { error: null, data };
  } catch (error: any) {
    return { error, data: null };
  }
}

export default fetcher;
