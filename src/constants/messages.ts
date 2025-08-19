import { ApiResponse } from "../interfaces";

export const DEFAULT_HEALTH_ENDPOINT_MESSAGE =
  "May the moon shine upon you, Sunless one.";
export const UNEXPECTED_ERROR_DEFAULT_MESSAGE =
  "An unexpected error has occurred, if you have acces to the server check logs for more info or contact an admin.";
export const INSUFICIENT_PERMISSIONS_MESSAGE = "You shall not pass!";
export const INVALID_USER_STATUS_MESSAGE = "You are no longer welcome here.";
export const USER_SUCCESSFUL_CREATION_MESSAGE = "User successfully created.";
export const USERNAME_ALREADY_IN_USE_MESSAGE = "username already in use.";
export const EMAIL_ALREADY_IN_USE_MESSAGE = "email already in use.";
export const DUPLICATED_PRIMARY_KEY_MESSAGE =
  "A user with the same primary key already exists.";
export const ROLE_FOREIGN_KEY_VIOLATION_MESSAGE =
  "The provided 'roleID' does not correspond to a valid role.";
export const USER_FOREIGN_KEY_VIOLATION_MESSAGE =
  "The provided 'userID' does not correspond to a valid user.";
export const USERS_SUCCESSFULLY_RETRIEVED_MESSAGE =
  "Users successfully retrieved.";
export const USER_SUCCESSFULLY_DELETED_MESSAGE =
  "The user has been successfully deleted.";
export const EXPERIENCE_SUCCESSFULLY_DELETED_MESSAGE =
  "The experience has been successfully deleted.";
export const USER_SUCCESSFULLY_RECOVERED_MESSAGE =
  "The user has been successfully recovered.";
export const USER_SUCCESSFULLY_BANNED_MESSAGE =
  "The user has been successfully banned.";
export const USER_SUCCESSFULLY_UNBANNED_MESSAGE =
  "The user has been successfully unbanned.";
export const USER_NOT_FOUND_MESSAGE =
  "The user with the given id does not exists.";
export const EXPERIENCE_NOT_FOUND_MESSAGE =
  "The experience with the given id does not exists.";
export const INVALID_USER_MESSAGE = "Your current user is invalid.";
export const USER_ROLE_SUCCESSFULY_UPDATED = "Role updated successfully.";
export const USER_SUCESSFULLY_UPDATED =
  "The user has been successfully updated.";
export const EXPERIENCE_SUCCESSFULLY_CREATED =
  "The experience has been successfully created.";
export const EXPERIENCE_SUCCESSFULY_UPDATED =
  "Experience updated successfully.";
export const EDUCATION_SUCCESSFULLY_CREATED = "Study successfully created.";
export const EDUCATION_SUCCESSFULLY_DELETED = "Study successfully deleted.";
export const EDUCATION_NOT_FOUND_MESSAGE =
  "The education with the given id does not exists.";

export const DEFAULT_SUCCES_API_RESPONSE: ApiResponse<[]> = {
  status: 200,
  message: "Sucessful request",
  data: [],
  pagination: {
    offset: 0,
    limit: 0,
    count: 0,
    total: 0,
  },
};

export const DEFAULT_ERROR_API_RESPONSE: ApiResponse<[]> = {
  status: 500,
  message: UNEXPECTED_ERROR_DEFAULT_MESSAGE,
  data: [],
  pagination: {
    offset: 0,
    limit: 0,
    count: 0,
    total: 0,
  },
};
