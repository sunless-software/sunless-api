import { Request, Response, NextFunction } from "express";
import { CustomError } from "../interfaces";
import {
  ERROR_TYPE_BAN_USER,
  ERROR_TYPE_CREATE_EDUCATION,
  ERROR_TYPE_CREATE_EXPERIENCE,
  ERROR_TYPE_CREATE_USER,
  ERROR_TYPE_DELETE_EDUCATION,
  ERROR_TYPE_DELETE_EXPERIENCE,
  ERROR_TYPE_DELETE_USER,
  ERROR_TYPE_RECOVER_USER,
  ERROR_TYPE_UNBAN_USER,
  ERROR_TYPE_UPDATE_EDUCATION,
  ERROR_TYPE_UPDATE_EXPERIENCE,
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
import createExperienceErrorHandler from "../errorHandlers/createExperienceErrorHandler";
import deleteExperienceErrorHandler from "../errorHandlers/deleteExperienceErrorHandler";
import updateExperienceErrorHandler from "../errorHandlers/updateExperienceErrorHandler";
import createEducationErrorHandler from "../errorHandlers/createEducationErrorHandler";
import deleteEducationErrorHandler from "../errorHandlers/deleteEducationErrorHandler";
import updateEducationErrorHandler from "../errorHandlers/updateEducationErrorHandler";

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
    case ERROR_TYPE_CREATE_EXPERIENCE:
      return createExperienceErrorHandler(err, req, res);
    case ERROR_TYPE_DELETE_EXPERIENCE:
      return deleteExperienceErrorHandler(err, req, res);
    case ERROR_TYPE_UPDATE_EXPERIENCE:
      return updateExperienceErrorHandler(err, req, res);
    case ERROR_TYPE_CREATE_EDUCATION:
      return createEducationErrorHandler(err, req, res);
    case ERROR_TYPE_DELETE_EDUCATION:
      return deleteEducationErrorHandler(err, req, res);
    case ERROR_TYPE_UPDATE_EDUCATION:
      return updateEducationErrorHandler(err, req, res);
  }

  logger.error("The following unhandled error has occurred: ");
  logger.error(JSON.stringify(err));

  return sendResponse(DEFAULT_ERROR_API_RESPONSE, res);
}
