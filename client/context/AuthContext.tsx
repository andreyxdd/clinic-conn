import React, { useContext, createContext } from 'react';
import axios from 'axios';
import useSWR from 'swr';
import env from '../config/env';
import { setAccessToken } from '../config/auth';
import { IUser } from '../config/types';
import { fetcher, poster } from '../lib/auth/csr';

interface IAuthProvider {
  children: React.ReactNode;
}

interface IAuthResponse{
  ok: boolean;
  message?: string;
  user?: IUser | null;
}

interface IAuthContext{
  // eslint-disable-next-line no-unused-vars
  login: (email: string, password: string) => Promise<IAuthResponse>;
  logout: () => Promise<IAuthResponse>;
  // eslint-disable-next-line no-unused-vars
  getUser: (url: string)=> Promise<IUser | null>;
}

const AuthContext = createContext<IAuthContext | null>(null);

// provider hook that creates auth object
const useAuthProvider = () => {
  const login = async (email: string, password: string): Promise<IAuthResponse> => {
    const res = await axios.post(`${env.api}/auth/login`,
      {
        email,
        password,
      },
      { withCredentials: true });

    if (res.status === 200) {
      setAccessToken(res.data.accessToken);
      return { ok: true, user: res.data.user };
    }

    if (res.status === 403) {
      if (res.data.field === 'email') {
        return { ok: false, message: 'User with provided email not found' };
      } if (res.data.field === 'password') {
        return { ok: false, message: 'Inalid password provided' };
      } if (res.data.field === 'isVerified') {
        return { ok: false, message: 'Your account is not comfirmed' };
      }
    }

    return { ok: false, message: 'Internal Server Error' };
  };

  const logout = async (): Promise<IAuthResponse> => {
    const res = await poster(`${env.api}/auth/logout`);

    if (res.error) {
      return { ok: false, message: 'Internal Server Error' };
    }

    setAccessToken('');
    return { ok: true };
  };

  const getUser = async (url: string): Promise<IUser | null> => {
    const res = await fetcher<IUser>(`${env.api}${url}`);

    if (res.error) {
      return null;
    }

    return res.data;
  };

  return { login, logout, getUser };
};

// Context provider component wrapping the _app component.
// It allows to use auth context in any child.
export const AuthProvider = ({ children }: IAuthProvider) => {
  const auth = useAuthProvider();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

// Hook to provide child components access to authContext
export const useAuth = () => useContext(AuthContext) as IAuthContext;

export const useUser = () => {
  const auth = useAuth();

  const { data, mutate, error } = useSWR('/user/get', auth?.getUser, {
    revalidateOnFocus: false,
    refreshInterval: 600000, // every ten minutes
  });

  const loading = !data && !error;

  return {
    loading,
    error,
    user: data,
    mutate,
  };
};
