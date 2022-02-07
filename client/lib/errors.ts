import { AxiosError } from 'axios';

const getError = (error: AxiosError) => {
  if (error.isAxiosError && error.response) return error.response.data;
  return 'Unexpected error';
};

export default getError;
