/*
 * Methods to handle post and get requests that require token validation
 * when page is client-side rendered (CSR).
 */
import axios, { AxiosResponse } from 'axios';
import { getAccessToken, setAccessToken } from '../../config/auth';
import { QueryResponse } from '../../config/types';
import env from '../../config/env';
import { handleError } from './index';

/*
 * Refresh access (inrun time memory) and refrestoken (in browser cookeis)
 */
export const refreshTokens = async () => {
  const response = await axios.get(
    `${env.api}/auth/refresh_tokens`,
    { withCredentials: true },
  );

  setAccessToken(response.data.accessToken);
};

/*
 * Method to handle any request that requires authorization.
 * If original request returns '401' error, this functions will first
 * try to refresh tokens and only then make second request
 */
export const handleRequest = async (request: () => Promise<AxiosResponse>): Promise<AxiosResponse> => {
  try {
    return await request();
  } catch (error: any) {
    if (error?.response?.status === 401) {
      try {
        await refreshTokens();
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
export async function fetcher<T>(uri: string): Promise<QueryResponse<T>> {
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

/*
 * Post data to server only if user authorized
 */
export async function poster<T>(url: string, payload?: unknown): Promise<QueryResponse<T>> {
  try {
    const request = () => axios.post(
      url,
      payload,
      {
        withCredentials: true,
        headers: { authorization: `bearer ${getAccessToken()}` },
      },
    );
    const { data } = await handleRequest(request);
    return { error: null, data };
  } catch (error : any) {
    return { error, data: null };
  }
}
