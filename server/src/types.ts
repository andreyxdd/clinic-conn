import { Request, Response } from 'express';

export interface IPayload{
  userId: string
}

export interface AuthContext{
  req: Request;
  res: Response;
  payload?: IPayload;
}
