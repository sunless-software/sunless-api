import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ApiResponse } from "./interfaces";
import { NextFunction, Response, Request } from "express";
import { ValidationError, validationResult } from "express-validator";
import {
  HTTP_STATUS_CODE_BAD_REQUEST,
  HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR,
} from "./constants/constants";
import {
  DEFAULT_SUCCES_API_RESPONSE,
  UNEXPECTED_ERROR_DEFAULT_MESSAGE,
} from "./constants/messages";
import logger from "./logger";

export async function encryptPassword(password: string) {
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);

  return hash;
}

export async function checkPassword(password: string, hash: string) {
  const match = await bcrypt.compare(password, hash);
  return match;
}

export function signJWT(
  payload: object,
  secret: string,
  expiresIn: "1h" | "4h" | "8h" | "1d"
) {
  return jwt.sign(payload, secret, { expiresIn: expiresIn });
}

export function sendResponse<T>(response: ApiResponse<T>, res: Response) {
  return res.status(response.status).send(response);
}

export function validateResult(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    validationResult(req).throw();
    return next();
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "array" in error &&
      typeof error.array === "function"
    ) {
      const response: ApiResponse<null> = {
        status: HTTP_STATUS_CODE_BAD_REQUEST,
        message: "Invalid request",
        data: error.array(),
      };

      return sendResponse(response, res);
    }

    logger.error(
      "Error while trying to validate the result of a validation. Are you sure you are calling this function from a validation?"
    );
    return sendResponse(
      {
        ...DEFAULT_SUCCES_API_RESPONSE,
        status: HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR,
        message: UNEXPECTED_ERROR_DEFAULT_MESSAGE,
      },
      res
    );
  }
}
