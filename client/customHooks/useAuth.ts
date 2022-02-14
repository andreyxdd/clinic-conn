import React from 'react';
import shallow from 'zustand/shallow';
import { useAuthStore } from '../context/AuthStore';
import { IUser } from '../config/types';
import { fetcher } from '../lib/auth/csr';
import env from '../config/env';
import isBrowser from '../utils/isBrowser';

const useAuth = () => {
  const {
    user, setUser, login, register, logout, userHasMounted, setUserHasMounted,
  } = useAuthStore(
    (store) => ({
      user: store.user,
      setUser: store.setUser,
      login: store.login,
      register: store.register,
      logout: store.logout,
      userHasMounted: store.userHasMounted,
      setUserHasMounted: store.setUserHasMounted,
    }),
    shallow,
  );

  // checking authorization and getting
  // user data if there is valid refresh token
  const fetchUser = React.useCallback(async () => {
    const res = await fetcher<IUser>(`${env.api}/user/get`);
    if (res.data) setUser(res.data);
    setUserHasMounted();
  }, []);

  React.useEffect(() => {
    if (isBrowser) {
      if (!userHasMounted) { fetchUser(); }
    }
  }, []);

  return {
    user, login, register, logout,
  };
};

export default useAuth;
