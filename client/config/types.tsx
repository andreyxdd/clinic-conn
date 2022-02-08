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
