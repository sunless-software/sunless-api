import { Request, Response, NextFunction } from "express";
import logger from "../logger";
import { sendResponse } from "../utils";
import {
  DEFAULT_SUCCES_API_RESPONSE,
  INSUFICIENT_PERMISSIONS_MESSAGE,
  INVALID_USER_STATUS_MESSAGE,
  UNEXPECTED_ERROR_DEFAULT_MESSAGE,
} from "../constants/messages";
import {
  HTTP_STATUS_CODE_FORBIDDEN,
  HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR,
} from "../constants/httpStatusCodes";
import { AuthRequest, Permission } from "../interfaces";
import connectToDB from "../db";
import { GET_USER_PERMISSIONS, GET_USER_STATUS } from "../constants/queries";

/**
 * This function return a middleware which checks permissions required to reach an endpoint.
 *
 * @param oneOf - A list of permissions. At least one should be owned by the user.
 * @param allOf - A list of permissions. All of them should be owned by the user.
 *
 * @returns - A middleware function.
 */
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

    const userStatus = await db.query(GET_USER_STATUS, [jwtPayload.id]);
    const banned = userStatus.rows[0].banned;
    const deleted = userStatus.rows[0].deleted;

    if (banned || deleted) {
      return sendResponse(
        {
          ...DEFAULT_SUCCES_API_RESPONSE,
          status: HTTP_STATUS_CODE_FORBIDDEN,
          message: INVALID_USER_STATUS_MESSAGE,
        },
        res
      );
    }

    const result = await db.query(GET_USER_PERMISSIONS, [jwtPayload.id]);
    const userPermissions = result.rows;

    const oneOfFulfilled = oneOf.length
      ? oneOf.some((requiredPermission) =>
          userPermissions.some(
            (userPermission) => userPermission.id === requiredPermission.id
          )
        )
      : true;

    const allOfFulfilled = allOf.length
      ? allOf.every((requiredPermissions) =>
          userPermissions.some(
            (userPermission) => userPermission.id === requiredPermissions.id
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
