import { Request, Response, NextFunction } from "express";
import logger from "../logger";
import { sendResponse } from "../utils";
import {
  DEFAULT_API_RESPONSE,
  UNEXPECTED_ERROR_DEFAULT_MESSAGE,
} from "../constants/messages";
import { HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR } from "../constants/constants";
import { AuthRequest } from "../interfaces";
import connectToDB from "../db";
import { GET_USER_PERMISSIONS } from "../constants/queries";

export default async function roleMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!("user" in req)) {
    logger.error(
      `"user" key was not found in the request object.
      Probably you are using this middleware before using the authentication middleware.`
    );

    return sendResponse(
      {
        ...DEFAULT_API_RESPONSE,
        status: HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR,
        message: UNEXPECTED_ERROR_DEFAULT_MESSAGE,
      },
      res
    );
  }

  const jwtPayload = (req as AuthRequest).user;
  const db = await connectToDB();

  const permissions = await db.query(GET_USER_PERMISSIONS, [jwtPayload.id]);
  console.log(permissions.rows);
  return next();
}
