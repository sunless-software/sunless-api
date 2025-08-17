import { Request, Response } from "express";
import { isPgError, sendResponse } from "../utils";
import {
  DEFAULT_ERROR_API_RESPONSE,
  EMAIL_ALREADY_IN_USE_MESSAGE,
  USER_NOT_FOUND_MESSAGE,
  USERNAME_ALREADY_IN_USE_MESSAGE,
} from "../constants/messages";
import { CustomError } from "../interfaces";
import logger from "../logger";
import {
  PG_FOREIGN_KEY_VIOLATION_CODE,
  PG_UNIQUE_VIOLATION_CODE,
} from "../constants/pgErrorCodes";
import {
  HTTP_STATUS_CODE_CONFLICT,
  HTTP_STATUS_CODE_NOT_FOUND,
} from "../constants/httpStatusCodes";

export default function updateUserErrorHandler(
  err: CustomError,
  req: Request,
  res: Response
) {
  if (isPgError(err.error)) {
    switch (err.error.code) {
      case PG_UNIQUE_VIOLATION_CODE:
        let response = handleDuplicatedKeyViolation(
          (err.error as { constraint?: string }).constraint as string
        );

        return sendResponse(response, res);
      default:
        logger.error(
          "The following unexpected error has occurred while trying to patch a user: "
        );
        logger.error(JSON.stringify(err));

        return sendResponse(DEFAULT_ERROR_API_RESPONSE, res);
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
}

function handleDuplicatedKeyViolation(violation: string) {
  const USERNAME_VIOLATION = "users_username_key";
  const EMAIL_VIOLATION = "users_email_key";

  switch (violation) {
    case USERNAME_VIOLATION:
      return {
        ...DEFAULT_ERROR_API_RESPONSE,
        status: HTTP_STATUS_CODE_CONFLICT,
        message: USERNAME_ALREADY_IN_USE_MESSAGE,
      };
    case EMAIL_VIOLATION:
      return {
        ...DEFAULT_ERROR_API_RESPONSE,
        status: HTTP_STATUS_CODE_CONFLICT,
        message: EMAIL_ALREADY_IN_USE_MESSAGE,
      };
    default:
      logger.error(
        `An unhandled not unique contraint violation was throw while trying to patch a user: "${violation}"`
      );
      return DEFAULT_ERROR_API_RESPONSE;
  }
}
