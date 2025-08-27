import { Request, Response, NextFunction } from "express";
import { isPgError, sendResponse } from "../utils";
import {
  DEFAULT_ERROR_API_RESPONSE,
  ENTITY_NOT_FOUND_MESSAGE,
  EXPIRED_JWT_MESSAGE,
  FOREIGN_KEY_VIOLATION_MESSAGE,
  INCORRECT_USER_INVITATION_MESSAGE,
  INVALID_JWT_MESSAGE,
  INVALID_JWT_SIGNATURE_MESSAGE,
  MALFORMED_JWT_MESSAGE,
} from "../constants/messages";
import logger from "../logger";
import {
  HTTP_STATUS_CODE_BAD_REQUEST,
  HTTP_STATUS_CODE_CONFLICT,
  HTTP_STATUS_CODE_FORBIDDEN,
  HTTP_STATUS_CODE_NOT_FOUND,
  HTTP_STATUS_CODE_UNAUTHORIZED,
} from "../constants/httpStatusCodes";
import {
  INCORRECT_USER_INVITATION,
  JWT_EXPIRED,
  JWT_INVALID,
  JWT_INVALID_SIGNATURE,
  JWT_MALFORMED,
  PG_FOREIGN_KEY_VIOLATION_CODE,
  PG_UNIQUE_VIOLATION_CODE,
} from "../constants/managedErrors";
import { handleDuplicatedKeyViolation } from "../errorHandlers/duplicatedKeysHandler";

export default async function errorHandlerMiddleware(
  error: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  if (isPgError(error)) {
    // Postgres error handling
    switch (error.code) {
      case PG_FOREIGN_KEY_VIOLATION_CODE:
        return sendResponse(
          {
            ...DEFAULT_ERROR_API_RESPONSE,
            status: HTTP_STATUS_CODE_CONFLICT,
            message: FOREIGN_KEY_VIOLATION_MESSAGE,
          },
          res
        );
      case PG_UNIQUE_VIOLATION_CODE:
        return sendResponse(
          handleDuplicatedKeyViolation((error as any).constraint),
          res
        );
      default:
        logger.error(`The following unexpected postgres error has occurred: `);
        logger.error(JSON.stringify(error));
    }
  } else if (error && typeof error === "object" && "message" in error) {
    // Handled errors
    switch (error.message) {
      case HTTP_STATUS_CODE_NOT_FOUND.toString():
        return sendResponse(
          {
            ...DEFAULT_ERROR_API_RESPONSE,
            status: HTTP_STATUS_CODE_NOT_FOUND,
            message: ENTITY_NOT_FOUND_MESSAGE,
          },
          res
        );
      case JWT_MALFORMED:
        return sendResponse(
          {
            ...DEFAULT_ERROR_API_RESPONSE,
            status: HTTP_STATUS_CODE_UNAUTHORIZED,
            message: MALFORMED_JWT_MESSAGE,
          },
          res
        );
      case JWT_INVALID:
        return sendResponse(
          {
            ...DEFAULT_ERROR_API_RESPONSE,
            status: HTTP_STATUS_CODE_UNAUTHORIZED,
            message: INVALID_JWT_MESSAGE,
          },
          res
        );
      case JWT_INVALID_SIGNATURE:
        return sendResponse(
          {
            ...DEFAULT_ERROR_API_RESPONSE,
            status: HTTP_STATUS_CODE_UNAUTHORIZED,
            message: INVALID_JWT_SIGNATURE_MESSAGE,
          },
          res
        );
      case JWT_EXPIRED:
        return sendResponse(
          {
            ...DEFAULT_ERROR_API_RESPONSE,
            status: HTTP_STATUS_CODE_UNAUTHORIZED,
            message: EXPIRED_JWT_MESSAGE,
          },
          res
        );
      case INCORRECT_USER_INVITATION:
        return sendResponse(
          {
            ...DEFAULT_ERROR_API_RESPONSE,
            status: HTTP_STATUS_CODE_FORBIDDEN,
            message: INCORRECT_USER_INVITATION_MESSAGE,
          },
          res
        );
      default:
        logger.error(`The following unhandled error has occurred: `);
        logger.error(JSON.stringify(error));
    }
  } else {
    // Unexpected errors
    logger.error(`The following unexpected error has occurred: `);
    logger.error(JSON.stringify(error));
  }

  return sendResponse(DEFAULT_ERROR_API_RESPONSE, res);
}
