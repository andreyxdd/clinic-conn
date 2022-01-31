import React, { createContext } from 'react';
import { IAppContextProps } from '../types';

export const AppContext = createContext<IAppContextProps | null>(null);

interface IAppContextProviderProps {
  children: React.ReactNode;
}

const AppContextProvider = ({
  children,
}:IAppContextProviderProps) => {
  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const providerValue: IAppContextProps = {
    hello: '',
  };

  return (
    <AppContext.Provider value={providerValue as IAppContextProps}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
