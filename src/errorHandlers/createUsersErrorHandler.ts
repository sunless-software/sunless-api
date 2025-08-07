import { Request, Response } from "express";
import { isPgError, sendResponse } from "../utils";
import {
  DEFAULT_ERROR_API_RESPONSE,
  DEFAULT_SUCCES_API_RESPONSE,
  DUPLICATED_PRIMARY_KEY_MESSAGE,
  EMAIL_ALREADY_IN_USE_MESSAGE,
  ROLE_FOREIGN_KEY_VIOLATION_MESSAGE,
  USERNAME_ALREADY_IN_USE_MESSAGE,
} from "../constants/messages";
import { CustomError } from "../interfaces";
import logger from "../logger";
import {
  HTTP_STATUS_CODE_CONFLICT,
  PG_FOREIGN_KEY_VIOLATION_CODE,
  PG_UNIQUE_VIOLATION_CODE,
} from "../constants/constants";

export default function createUserErrorHandler(
  err: CustomError,
  req: Request,
  res: Response
) {
  if (!isPgError(err.error)) {
    logger.error(
      "The following unexpected error has occurred while trying to create a new user: "
    );
    logger.error(err);

    sendResponse(DEFAULT_ERROR_API_RESPONSE, res);
    return;
  }

  switch (err.error.code) {
    case PG_UNIQUE_VIOLATION_CODE:
      let response = handleDuplicatedKeyViolation(
        (err.error as { constraint?: string }).constraint as string
      );

      return sendResponse(response, res);
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
        `An unhandled pg error was thrown while trying to create a new user: `
      );
      logger.error(JSON.stringify(err));

      return sendResponse(DEFAULT_ERROR_API_RESPONSE, res);
  }
}

function handleDuplicatedKeyViolation(violation: string) {
  const USERNAME_VIOLATION = "users_username_key";
  const EMAIL_VIOLATION = "users_email_key";
  const ID_VIOLATION = "users_pkey";

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
    case ID_VIOLATION:
      return {
        ...DEFAULT_ERROR_API_RESPONSE,
        status: HTTP_STATUS_CODE_CONFLICT,
        message: DUPLICATED_PRIMARY_KEY_MESSAGE,
      };
    default:
      logger.error(
        `An unhandled not unique contraint violation was throw while trying to create a new user: "${violation}"`
      );
      return DEFAULT_ERROR_API_RESPONSE;
  }
}
