import { useLayoutEffect } from 'react';
import create from 'zustand';
import createContext from 'zustand/context';

export interface IStore {
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
  showNavbar: false,
  showTransition: false,
  containerMaxWidth: 'xs',
};

let store: any;

const zustandContext = createContext<IStore>();

const { Provider } = zustandContext;
export const UIProvider = Provider;

const { useStore } = zustandContext;
export const useUIStore = useStore;

export const initializeStore = (preloadedState = {}) => (
  create<IStore>(
    (set): IStore => ({
      ...initialState,
      ...preloadedState,
      setShowNavbar: (showNavbar: boolean) => { set({ showNavbar }); },
      setShowTransition: (showTransition: boolean) => { set({ showTransition }); },
      setContainerMaxWidth: (containerMaxWidth: string) => { set({ containerMaxWidth }); },
    }),
  )
);

export function useCreateUIStore(state: IStore) {
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
