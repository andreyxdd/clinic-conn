import React from 'react';
import { useRouter } from 'next/router';
import { useStore } from '../context/storeZustand';

const useUserRedirect = ({ after = 0, where = '/home' }) => {
  const router = useRouter();
  const user = useStore((state) => state.user);
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
