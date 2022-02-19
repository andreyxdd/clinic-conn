import React from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '../context/AuthStore';

interface IUseUserRedirect{
  after: number; // in secs after which to redirect user
  where: string; // destination page for redirect
  whom: string; // whom to redirect
}

const defaultProps = {
  after: 0,
  where: '/home',
  whom: 'all',
};

const useUserRedirect = (
  props: IUseUserRedirect = defaultProps,
) => {
  const {
    after,
    where,
    whom,
  } = props;

  const router = useRouter();
  const { user } = useAuthStore();

  React.useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      const redirectAfter = () => setTimeout(() => {
        router.push(where);
      }, after * 1000);

      if (whom === 'all') {
        redirectAfter();
      } else if (whom === 'user') {
        if (user) redirectAfter();
      } else if (whom === 'nonuser') {
        if (!user) redirectAfter();
      } else {
        throw new Error(`Paramerter whom = ${whom} not implemented`);
      }
    }

    return () => { isMounted = false; };
  }, []);

  return !!user;
};

export default useUserRedirect;
