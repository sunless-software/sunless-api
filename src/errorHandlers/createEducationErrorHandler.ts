import { Request, Response } from "express";
import { isPgError, sendResponse } from "../utils";
import {
  DEFAULT_ERROR_API_RESPONSE,
  USER_FOREIGN_KEY_VIOLATION_MESSAGE,
} from "../constants/messages";
import { CustomError } from "../interfaces";
import logger from "../logger";
import {
  HTTP_STATUS_CODE_CONFLICT,
  HTTP_STATUS_CODE_NOT_FOUND,
} from "../constants/httpStatusCodes";

export default function createEducationErrorHandler(
  err: CustomError,
  req: Request,
  res: Response
) {
  if (isPgError(err.error)) {
    logger.error(
      `The following unexpected postgres error has occurred while trying to create a education: `
    );
    logger.error(JSON.stringify(err));
    return sendResponse(DEFAULT_ERROR_API_RESPONSE, res);
  }

  if (err.error && typeof err.error === "object" && "message" in err.error) {
    switch (err.error.message) {
      case HTTP_STATUS_CODE_NOT_FOUND.toString():
        return sendResponse(
          {
            ...DEFAULT_ERROR_API_RESPONSE,
            status: HTTP_STATUS_CODE_CONFLICT,
            message: USER_FOREIGN_KEY_VIOLATION_MESSAGE,
          },
          res
        );
    }
  }

  logger.error(
    `An unhandled error was thrown while trying to create a new education: `
  );
  logger.error(JSON.stringify(err));

  return sendResponse(DEFAULT_ERROR_API_RESPONSE, res);
}
