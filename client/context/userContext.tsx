import React, { createContext, useContext, useState } from 'react';
import { IUser } from '../config/types';

export interface IUserContext {
  user?: IUser | null;
  // eslint-disable-next-line no-unused-vars
  setUser: React.Dispatch<React.SetStateAction<IUser | null | undefined>>;
}

export const UserContext = createContext<IUserContext>(null!);

export function useUser() {
  return useContext(UserContext);
}

export interface IUserProvider {
  initialUser?: IUser;
  children: React.ReactNode;
}

export const UserProvider = (
  { initialUser, children }: IUserProvider,
) => {
  const [user, setUser] = useState<IUser | null | undefined>(initialUser);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
