import { Request, Response, NextFunction } from "express";
import { CustomError } from "../interfaces";
import { isPgError, sendResponse } from "../utils";
import {
  DEFAULT_ERROR_API_RESPONSE,
  ENTITY_NOT_FOUND_MESSAGE,
  FOREIGN_KEY_VIOLATION_MESSAGE,
} from "../constants/messages";
import logger from "../logger";
import {
  HTTP_STATUS_CODE_CONFLICT,
  HTTP_STATUS_CODE_NOT_FOUND,
} from "../constants/httpStatusCodes";
import {
  PG_FOREIGN_KEY_VIOLATION_CODE,
  PG_UNIQUE_VIOLATION_CODE,
} from "../constants/pgErrorCodes";
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
        sendResponse(
          {
            ...DEFAULT_ERROR_API_RESPONSE,
            status: HTTP_STATUS_CODE_NOT_FOUND,
            message: ENTITY_NOT_FOUND_MESSAGE,
          },
          res
        );
        return;
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
