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
