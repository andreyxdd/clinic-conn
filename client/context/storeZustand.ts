import { useLayoutEffect } from 'react';
import create from 'zustand';
import createContext from 'zustand/context';
import { IUser } from '../config/types';

export interface IStore {
  user: IUser | null;
  // eslint-disable-next-line no-unused-vars
  setUser: (user: IUser | null) => void;
  showNavbar: boolean;
  // eslint-disable-next-line no-unused-vars
  setShowNavbar: (show: boolean) => void;
  showTransition: boolean;
  // eslint-disable-next-line no-unused-vars
  setShowTransition: (show: boolean) => void;
  containerMaxWidth: string;
  // eslint-disable-next-line no-unused-vars
  setContainerMaxWidth: (mw: string) => void;
}

const initialState = {
  user: null,
  // eslint-disable-next-line no-unused-vars
  setUser: (user: IUser | null) => { },
  showNavbar: false,
  // eslint-disable-next-line no-unused-vars
  setShowNavbar: (show: boolean) => { },
  showTransition: false,
  // eslint-disable-next-line no-unused-vars
  setShowTransition: (show: boolean) => { },
  containerMaxWidth: 'xs',
  // eslint-disable-next-line no-unused-vars
  setContainerMaxWidth: (mw: string) => { },
};

let store: any;

const zustandContext = createContext<IStore>();
export const { Provider } = zustandContext;
// An example of how to get types
/** @type {import('zustand/index').UseStore<typeof initialState>} */
export const { useStore } = zustandContext;

export const initializeStore = (preloadedState = {}) => (
  create<IStore>(
    (set): IStore => ({
      ...initialState,
      ...preloadedState,
      setUser: (user: IUser | null) => { set({ user }); },
      setShowNavbar: (showNavbar: boolean) => { set({ showNavbar }); },
      setShowTransition: (showTransition: boolean) => { set({ showTransition }); },
      setContainerMaxWidth: (containerMaxWidth: string) => { set({ containerMaxWidth }); },
    }),
  )
);

export function useCreateStore(state: IStore) {
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
