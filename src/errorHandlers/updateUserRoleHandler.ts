import { Request, Response } from "express";
import { isPgError, sendResponse } from "../utils";
import {
  DEFAULT_ERROR_API_RESPONSE,
  ROLE_FOREIGN_KEY_VIOLATION_MESSAGE,
  USER_NOT_FOUND_MESSAGE,
} from "../constants/messages";
import { CustomError } from "../interfaces";
import logger from "../logger";
import {
  HTTP_STATUS_CODE_CONFLICT,
  HTTP_STATUS_CODE_NOT_FOUND,
} from "../constants/httpStatusCodes";
import { PG_FOREIGN_KEY_VIOLATION_CODE } from "../constants/pgErrorCodes";

export default function updateUserRoleHandler(
  err: CustomError,
  req: Request,
  res: Response
) {
  if (isPgError(err.error)) {
    switch (err.error.code) {
      case PG_FOREIGN_KEY_VIOLATION_CODE:
        return sendResponse(
          {
            ...DEFAULT_ERROR_API_RESPONSE,
            status: HTTP_STATUS_CODE_CONFLICT,
            message: ROLE_FOREIGN_KEY_VIOLATION_MESSAGE,
          },
          res
        );
      default:
        logger.error(
          `The following unexpected postgres error has occurred while trying to update role of a user: `
        );
        logger.error(JSON.stringify(err));
        sendResponse(DEFAULT_ERROR_API_RESPONSE, res);
        return;
    }
  }

  if (err.error && typeof err.error === "object" && "message" in err.error) {
    switch (err.error.message) {
      case HTTP_STATUS_CODE_NOT_FOUND.toString():
        sendResponse(
          {
            ...DEFAULT_ERROR_API_RESPONSE,
            status: HTTP_STATUS_CODE_NOT_FOUND,
            message: USER_NOT_FOUND_MESSAGE,
          },
          res
        );
        return;
    }
  }

  logger.error(
    "The following unexpected error has occurred while trying to update the role of a user: "
  );
  logger.error(err);
  sendResponse(DEFAULT_ERROR_API_RESPONSE, res);
  return;
}
