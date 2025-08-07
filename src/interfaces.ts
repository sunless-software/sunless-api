import { Request } from "express";

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: Array<T>;
}

export interface UserCredentials {
  id: number;
  username: string;
  iat: number;
  exp: number;
}

export interface AuthRequest extends Request {
  user: UserCredentials;
}

export interface Permission {
  id: number;
  name: string;
  scope: "GLOBAL" | "PROJECT";
}

export interface CustomError {
  errorType: string;
  error: unknown;
}
