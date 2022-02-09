import { useEffect } from 'react';
import { IUser } from '../config/types';
import { useUser } from '../context/userContext';
import fetcher from '../lib/api/csr/fetcher';
import env from '../config/env';

const useUserCSR = () => {
  const { user, setUser } = useUser();

  console.log('useUserCSR', user);

  useEffect(() => {
    const getUser = async () => {
      const { error, data } = await fetcher<IUser>(`${env.api}/user`);
      if (!error && data) {
        setUser(data);
      } else {
        console.log('useUserCSR 2 ', user);
        setUser(null);
      }
    };

    if (!user) getUser();
  }, []);

  console.log('useUserCSR 3', user);

  return { user, setUser };
};

export default useUserCSR;
