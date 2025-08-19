import { Request, Response } from "express";
import { isPgError, sendResponse } from "../utils";
import {
  DEFAULT_ERROR_API_RESPONSE,
  EMAIL_ALREADY_IN_USE_MESSAGE,
  EXPERIENCE_NOT_FOUND_MESSAGE,
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

export default function updateExperienceErrorHandler(
  err: CustomError,
  req: Request,
  res: Response
) {
  if (isPgError(err.error)) {
    logger.error(
      "The following unexpected error has occurred while trying to patch a experience: "
    );
    logger.error(JSON.stringify(err));

    return sendResponse(DEFAULT_ERROR_API_RESPONSE, res);
  }

  if (err.error && typeof err.error === "object" && "message" in err.error) {
    switch (err.error.message) {
      case HTTP_STATUS_CODE_NOT_FOUND.toString():
        sendResponse(
          {
            ...DEFAULT_ERROR_API_RESPONSE,
            status: HTTP_STATUS_CODE_NOT_FOUND,
            message: EXPERIENCE_NOT_FOUND_MESSAGE,
          },
          res
        );
        return;
    }
  }
}
