import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../utils";
import {
  DEFAULT_ERROR_API_RESPONSE,
  DEFAULT_SUCCES_API_RESPONSE,
  INVALID_USER_STATUS_MESSAGE,
  USER_NOT_FOUND_MESSAGE,
} from "../constants/messages";
import {
  HTTP_STATUS_CODE_FORBIDDEN,
  HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_CODE_NOT_FOUND,
  HTTP_STATUS_CODE_UNAUTHORIZED,
} from "../constants/httpStatusCodes";
import logger from "../logger";
import jwt from "jsonwebtoken";
import { UserCredentials, AuthRequest } from "../interfaces";
import { GET_USER_STATUS } from "../constants/queries";
import connectToDB from "../db";

export default async function authMiddleware(
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
        ...DEFAULT_SUCCES_API_RESPONSE,
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
        ...DEFAULT_SUCCES_API_RESPONSE,
        status: HTTP_STATUS_CODE_UNAUTHORIZED,
        message: "You must provide a token",
      },
      res
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedPayload = jwt.verify(token, secret) as UserCredentials;
    const db = await connectToDB();
    const userStatus = await db.query(GET_USER_STATUS, [decodedPayload.id]);

    if (!userStatus.rows.length) {
      return sendResponse(
        {
          ...DEFAULT_ERROR_API_RESPONSE,
          status: HTTP_STATUS_CODE_NOT_FOUND,
          message: USER_NOT_FOUND_MESSAGE,
        },
        res
      );
    }

    const banned = userStatus.rows[0].banned;

    if (banned) {
      return sendResponse(
        {
          ...DEFAULT_ERROR_API_RESPONSE,
          status: HTTP_STATUS_CODE_FORBIDDEN,
          message: INVALID_USER_STATUS_MESSAGE,
        },
        res
      );
    }

    (req as AuthRequest).user = decodedPayload;
    return next();
  } catch (err) {
    logger.warn(
      `A request was rejected because the authorization token was invalid. Token: ${token}`
    );
    sendResponse(
      {
        ...DEFAULT_SUCCES_API_RESPONSE,
        status: HTTP_STATUS_CODE_FORBIDDEN,
        message: "I see you, little mouse... you don't belong here. Run along!",
      },
      res
    );
  }
}
