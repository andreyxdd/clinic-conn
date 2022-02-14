/*
 * Helper-methods to handle post and get requests that require authorization
 */
import { AxiosError } from 'axios';

/*
 * Handle errors in the fetcher and poster
 */
export const handleError = (error: AxiosError) => {
  if (error.isAxiosError && error.response) return error.response.data;
  return 'Unexpected error';
};

export const dummy = '';
