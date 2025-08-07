import { ApiResponse } from "../interfaces";

export const DEFAULT_HEALTH_ENDPOINT_MESSAGE =
  "May the moon shine upon you, Sunless one.";
export const UNEXPECTED_ERROR_DEFAULT_MESSAGE =
  "An unexpected error has occurred, if you have acces to the server check logs for more info or contact an admin";
export const INSUFICIENT_PERMISSIONS_MESSAGE = "You shall not pass!";

export const DEFAULT_SUCCES_API_RESPONSE: ApiResponse<[]> = {
  status: 200,
  message: "Sucessful request",
  data: [],
};

export const DEFAULT_ERROR_API_RESPONSE: ApiResponse<[]> = {
  status: 500,
  message: UNEXPECTED_ERROR_DEFAULT_MESSAGE,
  data: [],
};
