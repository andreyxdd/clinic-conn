import axios from 'axios';
import { QueryResponse } from '../../../config/types';
import { handleRequestCSR } from '../index';

async function poster<T>(url: string, payload?: unknown): Promise<QueryResponse<T>> {
  try {
    const request = () => axios.post(url, payload, { withCredentials: true });
    const { data } = await handleRequestCSR(request);
    return { error: null, data };
  } catch (error : any) {
    return { error, data: null };
  }
}

export default poster;
