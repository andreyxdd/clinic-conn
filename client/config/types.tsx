export interface IClientContextProps{
  resetClient: () => void,
}

export interface IUserStateProps{
  isLoggedIn?: boolean;
  // eslint-disable-next-line no-unused-vars
  setIsLoggedIn: (val: boolean) => void;
}
export interface IPathProps{
  title: string;
  path: string;
}
