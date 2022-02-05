/*
import React, { createContext } from 'react';
import { Provider as URQLProvider, Client } from 'urql';
import { IClientContextProps, IUserStateProps } from '../config/types';
import useStore from '../config/store';

export const ClientContext = createContext<IClientContextProps | null>(null);

interface IClientProviderProps {
  // eslint-disable-next-line no-unused-vars
  makeClient: (userStateProps: IUserStateProps) => Client;
  children: React.ReactNode;
}

const ClientContextProvider = ({
  makeClient,
  children,
}: IClientProviderProps) => {
  const setIsLoggedIn = useStore((state) => state.setIsLoggedIn);
  const [client, setClient] = React.useState(
    makeClient({ setIsLoggedIn }),
  );

  return (
    <ClientContext.Provider value={{
      resetClient: () => setClient(
        makeClient({ setIsLoggedIn }),
      ),
    } as IClientContextProps}
    >
      <URQLProvider value={client}>
        {children}
      </URQLProvider>
    </ClientContext.Provider>
  );
};

export default ClientContextProvider;
*/
export { };
