import React from 'react';
import { useRouter } from 'next/router';
import { useUser } from '../context/userContext';

const useUserRedirect = ({ after = 0, where = '/home' }) => {
  const router = useRouter();
  const { user } = useUser();
  React.useEffect(() => {
    if (user) {
      setTimeout(() => {
        router.push(where);
      }, after * 1000);
    }
  }, []);

  return !!user;
};

export default useUserRedirect;
