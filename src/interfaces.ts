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

export interface ProjectInvitation {
  userID: number;
  projectID: number;
  projectRoleID: number;
  iat: number;
  exp: number;
}

export interface ProjectCollaborator {
  id: number;
  username: string;
  profile_photo: string;
  project_role_id: number;
  project_role_name: string;
}

export interface ProjectExternalResource {
  id: number;
  url: string;
  name: string;
  type: string;
}

export interface ProjectMedia {
  id: number;
  url: string;
  type: string;
}

export interface DefaultRole {
  id: number;
  role_name: string;
  permissions: Array<Permission>;
}
