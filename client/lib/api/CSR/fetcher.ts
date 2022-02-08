import axios from 'axios';
import { getAccessToken } from '../../../config/auth';
import { QueryResponse } from '../../../config/types';
import { handleRequestCSR } from '../index';

async function fetcher<T>(uri: string): Promise<QueryResponse<T>> {
  try {
    const request = () => (
      axios.get(uri,
        {
          withCredentials: true,
          headers: { authorization: `bearer ${getAccessToken()}` },
        })
    );
    const { data } = await handleRequestCSR(request);
    return { error: null, data };
  } catch (error: any) {
    return { error, data: null };
  }
}

export default fetcher;
