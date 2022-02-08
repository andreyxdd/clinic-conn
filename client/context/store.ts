/*
import create from 'zustand';
import { IUser } from './types';

export interface IUserStore {
  user?: IUser;
  // eslint-disable-next-line no-unused-vars
  setUser: (user: IUser | undefined) => void;
}

export const useStore = create<IUserStore>((set) => ({
  user: undefined,
  setUser: (user: IUser | undefined) => set({ user }),
}));
*/

import { useLayoutEffect } from 'react';
import create, { StoreApi, UseBoundStore } from 'zustand';
import createContext from 'zustand/context';
import { IUser } from '../config/types';

const initialState = {
  user: undefined,
};

let store: UseBoundStore<IUserStore, StoreApi<IUserStore>>;

export interface IUserStore {
  user?: IUser;
  // eslint-disable-next-line no-unused-vars
  setUser?: (user: IUser | undefined) => void;
}

const zustandContext = createContext();
export const { Provider } = zustandContext;
// An example of how to get types
/** @type {import('zustand/index').UseStore<typeof initialState>} */
export const { useStore } = zustandContext;

export const initializeStore = (preloadedState = {}) => create<IUserStore>((set, get) => ({
  ...initialState,
  ...preloadedState,
  // eslint-disable-next-line no-unused-vars
  setUser: (user: IUser | undefined) => set({ user: get().user }),
}));

export function useCreateStore(state: any) {
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
    if (state && store()) {
      store.setState({
        ...store.getState(),
        ...state,
      });
    }
  }, [state]);

  return () => store;
}
