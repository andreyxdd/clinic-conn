import { useEffect } from 'react';
import { IUser } from '../config/types';
import { useUser } from '../context/userContext';
import fetcher from '../lib/fetcher';
import env from '../lib/env';

const useUserCSR = () => {
  const { user, setUser } = useUser();

  useEffect(() => {
    const getUser = async () => {
      const { error, data } = await fetcher<IUser>(`${env.serverUri}/user`);
      if (!error && data) setUser(data);
    };

    if (!user) getUser();
  }, []);

  return { user, setUser };
};

export default useUserCSR;
