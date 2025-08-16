import { Request, Response, NextFunction } from "express";
import { CustomError } from "../interfaces";
import {
  ERROR_TYPE_BAN_USER,
  ERROR_TYPE_CREATE_USER,
  ERROR_TYPE_DELETE_USER,
} from "../constants/customErrors";
import { sendResponse } from "../utils";
import { DEFAULT_ERROR_API_RESPONSE } from "../constants/messages";
import logger from "../logger";
import createUserErrorHandler from "../errorHandlers/createUsersErrorHandler";
import deleteUserErrorHandler from "../errorHandlers/deleteUserErrorHandler";
import banUserErrorHandler from "../errorHandlers/banUserErrorHandler";

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
  }

  logger.error("The following unhandled error has occurred: ");
  logger.error(JSON.stringify(err));

  return sendResponse(DEFAULT_ERROR_API_RESPONSE, res);
}
