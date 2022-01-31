import { useContext } from 'react';
import { AppContext } from '../context/AppContextProvider';
import { IAppContextProps } from '../types';

// hook to resolve types
// eslint-disable-next-line import/prefer-default-export
export const useContextTypes = () => useContext(AppContext) as IAppContextProps;
