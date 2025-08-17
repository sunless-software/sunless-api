import { Request, Response, NextFunction } from "express";
import { CustomError } from "../interfaces";
import {
  ERROR_TYPE_BAN_USER,
  ERROR_TYPE_CREATE_USER,
  ERROR_TYPE_DELETE_USER,
  ERROR_TYPE_RECOVER_USER,
  ERROR_TYPE_UNBAN_USER,
  ERROR_TYPE_UPDATE_USER,
  ERROR_TYPE_UPDATE_USER_ROLE,
} from "../constants/customErrors";
import { sendResponse } from "../utils";
import { DEFAULT_ERROR_API_RESPONSE } from "../constants/messages";
import logger from "../logger";
import createUserErrorHandler from "../errorHandlers/createUsersErrorHandler";
import deleteUserErrorHandler from "../errorHandlers/deleteUserErrorHandler";
import banUserErrorHandler from "../errorHandlers/banUserErrorHandler";
import unbanUserErrorHandler from "../errorHandlers/unbanUserErrorHandler";
import recoverUserErrorHandler from "../errorHandlers/recoverUserErrorHandler";
import updateUserRoleHandler from "../errorHandlers/updateUserRoleHandler";
import updateUserErrorHandler from "../errorHandlers/updateUserErrorHandler";

export default async function errorHandlerMiddleware(
  err: CustomError,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  switch (err.errorType) {
    case ERROR_TYPE_CREATE_USER:
      return createUserErrorHandler(err, req, res);
    case ERROR_TYPE_DELETE_USER:
      return deleteUserErrorHandler(err, req, res);
    case ERROR_TYPE_BAN_USER:
      return banUserErrorHandler(err, req, res);
    case ERROR_TYPE_UNBAN_USER:
      return unbanUserErrorHandler(err, req, res);
    case ERROR_TYPE_RECOVER_USER:
      return recoverUserErrorHandler(err, req, res);
    case ERROR_TYPE_UPDATE_USER_ROLE:
      return updateUserRoleHandler(err, req, res);
    case ERROR_TYPE_UPDATE_USER:
      return updateUserErrorHandler(err, req, res);
  }

  logger.error("The following unhandled error has occurred: ");
  logger.error(JSON.stringify(err));

  return sendResponse(DEFAULT_ERROR_API_RESPONSE, res);
}
