import { ApiResponse } from "../interfaces";

export const DEFAULT_HEALTH_ENDPOINT_MESSAGE =
  "May the moon shine upon you, Sunless one.";
export const UNEXPECTED_ERROR_DEFAULT_MESSAGE =
  "An unexpected error has occurred, if you have acces to the server check logs for more info or contact an admin.";
export const INSUFICIENT_PERMISSIONS_MESSAGE = "You shall not pass!";
export const USER_SUCCESSFUL_CREATION_MESSAGE = "User successfully created.";
export const USERNAME_ALREADY_IN_USE_MESSAGE = "username already in use.";
export const EMAIL_ALREADY_IN_USE_MESSAGE = "email already in use.";
export const DUPLICATED_PRIMARY_KEY_MESSAGE =
  "A user with the same primary key already exists.";
export const ROLE_FOREIGN_KEY_VIOLATION_MESSAGE =
  "The provided 'roleID' does not correspond to a valid role.";
export const USERS_SUCCESSFULLY_RETRIEVED_MESSAGE =
  "Users successfully retrieved.";
export const USER_SUCCESSFULLY_DELETED_MESSAGE =
  "The user has been successfully deleted.";
export const USER_NOT_FOUND_MESSAGE =
  "The user with the given id does not exists.";

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
