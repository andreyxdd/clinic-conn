import React, { createContext, useContext } from 'react';
import { IUser } from '../config/types';

export interface IUserContext {
  user?: IUser | null;
  // eslint-disable-next-line no-unused-vars
  setUser: (value: IUser | null) => void; // React.Dispatch<React.SetStateAction<IUser | null >>;
}

export const UserContext = createContext<IUserContext>(null!);

export function useUser() {
  return useContext(UserContext);
}

export interface IUserProvider {
  initialContext: IUserContext;
  children: React.ReactNode;
}

export const UserProvider = (
  { initialContext, children }: IUserProvider,
) => (
  <UserContext.Provider value={initialContext}>
    {children}
  </UserContext.Provider>
);
