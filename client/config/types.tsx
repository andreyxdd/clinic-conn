export interface IPathProps{
  title: string;
  path: string;
}

export interface IUser {
  id: string;
  username: string;
}

export type QueryResponse<T> = {
  error: string | null, data: T | null
}

export interface IAuthStoreResponse{
  ok: boolean;
  message?: string;
}

export interface ILoginProps{
  email: string;
  password: string;
}

export interface IRegisterProps{
  email: string;
  username: string;
  password: string;
  firstName: string | null;
  lastName: string | null;
  birthday: string | null;
}

export interface IMessage{
  chatId?: string;
  message: string;
  username: string;
  time: string;
}
