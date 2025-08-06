import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../utils";
import { DEFAULT_API_RESPONSE } from "../constants/messages";
import {
  HTTP_STATUS_CODE_FORBIDDEN,
  HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_CODE_UNAUTHORIZED,
} from "../constants/constants";
import logger from "../logger";
import jwt from "jsonwebtoken";
import { UserCredentials, AuthRequest } from "../interfaces";

export default function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  const secret = process.env.SECRET;
  const SECRET_NOT_FOUND_MESSAGE = `Secret not found, please, contact an admin or if you have access check server logs for more info`;

  if (!secret) {
    logger.error(
      `The value of the environment variable "SECRET" was not found. Please check if it exists in the .env file.`
    );

    return sendResponse(
      {
        ...DEFAULT_API_RESPONSE,
        status: HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR,
        message: SECRET_NOT_FOUND_MESSAGE,
      },
      res
    );
  }

  if (!authHeader) {
    logger.warn(
      "A request was rejected because no authorization headers where provided."
    );
    return sendResponse(
      {
        ...DEFAULT_API_RESPONSE,
        status: HTTP_STATUS_CODE_UNAUTHORIZED,
        message: "You must provide a token",
      },
      res
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedPayload = jwt.verify(token, secret) as UserCredentials;
    (req as AuthRequest).user = decodedPayload;

    next();
  } catch (err) {
    logger.warn(
      `A request was rejected because the authorization token was invalid. Token: ${token}`
    );
    sendResponse(
      {
        ...DEFAULT_API_RESPONSE,
        status: HTTP_STATUS_CODE_FORBIDDEN,
        message: "I see you, little mouse... you don't belong here. Run along!",
      },
      res
    );
  }
}
