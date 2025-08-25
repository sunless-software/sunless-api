import { Request } from "express";
import { Pagination } from "./types";

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: Array<T>;
  pagination: Pagination;
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
}

export interface CustomError {
  errorType: string;
  error: unknown;
}

export interface User {
  id: 1;
  rol_id: number;
  username: string;
  password: string;
  profile_photo: string | null;
  phone: string | null;
  email: string | null;
  public: boolean;
  banned: boolean;
  deleted: boolean;
  created_at: string;
  updated_at: string;
}
