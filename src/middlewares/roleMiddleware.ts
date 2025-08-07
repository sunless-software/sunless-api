import { Request, Response, NextFunction } from "express";
import logger from "../logger";
import { sendResponse } from "../utils";
import {
  DEFAULT_ERROR_API_RESPONSE,
  DEFAULT_SUCCES_API_RESPONSE,
  INSUFICIENT_PERMISSIONS_MESSAGE,
  UNEXPECTED_ERROR_DEFAULT_MESSAGE,
} from "../constants/messages";
import {
  HTTP_STATUS_CODE_FORBIDDEN,
  HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR,
  PERMISSIONS,
} from "../constants/constants";
import { AuthRequest, Permission } from "../interfaces";
import connectToDB from "../db";
import { GET_USER_PERMISSIONS } from "../constants/queries";

export default function roleMiddleware(
  oneOf: Array<Permission> = [],
  allOf: Array<Permission> = []
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!("user" in req)) {
      logger.error(
        `"user" key was not found in the request object.
      Probably you are using this middleware before using the authentication middleware.`
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

    const jwtPayload = (req as AuthRequest).user;
    const db = await connectToDB();
    const result = await db.query(GET_USER_PERMISSIONS, [jwtPayload.id]);
    const userPermissions = result.rows;

    const oneOfFulfilled = oneOf.length
      ? oneOf.some((requiredPermission) =>
          userPermissions.some(
            (userPermission) =>
              userPermission.name === requiredPermission.name &&
              userPermission.scope === requiredPermission.scope
          )
        )
      : true;

    const allOfFulfilled = allOf.length
      ? allOf.every((requiredPermissions) =>
          userPermissions.some(
            (userPermission) =>
              userPermission.name === requiredPermissions.name &&
              userPermission.scope === requiredPermissions.scope
          )
        )
      : true;

    if (oneOfFulfilled && allOfFulfilled) return next();

    logger.warn(
      `The user with id "${jwtPayload.id}" tried to reach a resource but was rejected because insuficient permissions.`
    );

    return sendResponse(
      {
        ...DEFAULT_SUCCES_API_RESPONSE,
        status: HTTP_STATUS_CODE_FORBIDDEN,
        message: INSUFICIENT_PERMISSIONS_MESSAGE,
      },
      res
    );
  };
}
