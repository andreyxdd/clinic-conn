import axios, { AxiosError } from 'axios';
import { useLayoutEffect } from 'react';
import create from 'zustand';
import { persist } from 'zustand/middleware';
import createContext from 'zustand/context';
import { setAccessToken } from '../config/auth';
import env from '../config/env';
import {
  IUser, IAuthStoreResponse, ILoginProps, IRegisterProps,
} from '../config/types';
import { poster } from '../lib/auth/csr';

export interface IAuthStore {
  userHasMounted: boolean;
  user: IUser | null;
  // eslint-disable-next-line no-unused-vars
  login: (payload: ILoginProps) => Promise<IAuthStoreResponse>;
  // eslint-disable-next-line no-unused-vars
  register: (payload: IRegisterProps) => Promise<IAuthStoreResponse>;
  logout: () => Promise<IAuthStoreResponse>;
  // eslint-disable-next-line no-unused-vars
  setUser: (user: IUser | null) => void;
  // eslint-disable-next-line no-unused-vars
  setUserHasMounted: (b: boolean) => void;
}

const initialState = {
  userHasMounted: false,
  user: null,
};

let store: any;

const zustandContext = createContext<IAuthStore>();

const { Provider } = zustandContext;
export const AuthProvider = Provider;

const { useStore } = zustandContext;
export const useAuthStore = useStore;

export const initializeStore = (preloadedState = {}) => (
  create<IAuthStore>(persist(
    (set): IAuthStore => ({
      ...initialState,
      ...preloadedState,
      // -- login
      login: async ({ email, password }: ILoginProps): Promise<IAuthStoreResponse> => {
        try {
          const res = await axios.post(`${env.api}/auth/login`,
            {
              email,
              password,
            },
            { withCredentials: true });

          if (res.status === 200) {
            // seting access token in memory
            setAccessToken(res.data.accessToken);

            // setting user in the store
            set({ user: res.data.user });

            return { ok: true };
          }
        } catch (error) {
          const axiosError = error as AxiosError;
          const errorRes = axiosError.response;
          if (errorRes) {
            if (errorRes.status === 403) {
              return { ok: false, message: 'Invalid credentials provided or your account is not confirmed.' };
            }
          }
        }
        return { ok: false, message: 'Internal Error' };
      },
      // --
      // -- register
      register: async (payload: IRegisterProps): Promise<IAuthStoreResponse> => {
        const res = await axios.post(`${env.api}/auth/register`,
          payload,
          { withCredentials: true });

        if (res.status === 200) {
          return { ok: true };
        }

        return { ok: false, message: 'Internal Error' };
      },
      // --
      // -- logout
      logout: async (): Promise<IAuthStoreResponse> => {
        // logout requires authorization check
        // so we use poster instead of axios.post
        const res = await poster(`${env.api}/auth/logout`);

        if (res.error) {
          return { ok: false, message: res.error };
        }

        setAccessToken('');
        set({ user: null });

        return { ok: true };
      },
      // --
      setUserHasMounted: (b: boolean) => { set({ userHasMounted: b }); },
      setUser: (user: IUser | null) => { set({ user }); },
    }),
    // -- persist data using sessionStorage
    {
      name: 'authStore',
      getStorage: () => sessionStorage,
    },
  ))
);

export function useCreateAuthStore(state: IAuthStore) {
  // For SSR & SSG, always use a new store.
  if (typeof window === 'undefined') {
    return () => initializeStore(state);
  }

  // For CSR, always re-use same store.
  store = store ?? initializeStore(state);
  // And if initialState changes, then merge states in the next render cycle.
  //
  // eslint complaining "React Hooks must be called in the exact same order in every component render"
  // is ignorable as this code runs in same order in a given environment
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useLayoutEffect(() => {
    if (state && store) {
      store.setState({
        ...store.getState(),
        ...state,
      });
    }
  }, [state]);

  return () => store;
}
