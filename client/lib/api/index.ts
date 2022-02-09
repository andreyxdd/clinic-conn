import axios, { AxiosResponse, AxiosError } from 'axios';
import { setAccessToken } from '../../config/auth';
import env from '../../config/env';

export const handleError = (error: AxiosError) => {
  if (error.isAxiosError && error.response) return error.response.data;
  return 'Unexpected error';
};

export const refreshTokensCSR = async () => {
  const response = await axios.get(
    `${env.api}/auth/refresh_tokens`,
    { withCredentials: true },
  );

  setAccessToken(response.data.accessToken);
};

export const handleRequestCSR = async (request: () => Promise<AxiosResponse>): Promise<AxiosResponse> => {
  try {
    return await request();
  } catch (error: any) {
    if (error?.response?.status === 401) {
      try {
        await refreshTokensCSR();
        return await request();
      } catch (innerError: any) {
        throw handleError(innerError);
      }
    }

    throw handleError(error);
  }
};
