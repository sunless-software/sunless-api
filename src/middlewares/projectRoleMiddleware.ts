import { NextFunction, Request, Response } from "express";
import logger from "../logger";
import {
  DEFAULT_SUCCES_API_RESPONSE,
  INSUFICIENT_PERMISSIONS_MESSAGE,
  UNEXPECTED_ERROR_DEFAULT_MESSAGE,
} from "../constants/messages";
import {
  HTTP_STATUS_CODE_FORBIDDEN,
  HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR,
} from "../constants/httpStatusCodes";
import { sendResponse } from "../utils";
import { AuthRequest, Permission } from "../interfaces";
import connectToDB from "../db";
import {
  GET_USER_GLOBAL_PERMISSIONS,
  GET_USER_PROJECT_PERMISSIONS,
} from "../constants/queries";

export default function projectRoleMiddleware(
  requiredGlobalPermission: Permission,
  requiredProjectPermission: Permission
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const projectID = parseInt(req.params.projectID) || 0;

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

    const resultGlobalPermissions = await db.query(
      GET_USER_GLOBAL_PERMISSIONS,
      [jwtPayload.id]
    );
    const resultProjectPermissions = await db.query(
      GET_USER_PROJECT_PERMISSIONS,
      [jwtPayload.id, projectID]
    );

    const globalPermissions = resultGlobalPermissions.rows;
    const projectPermissions = resultProjectPermissions.rows;

    const globalFulfilled = !!globalPermissions.find(
      (gp) => gp.id === requiredGlobalPermission.id
    );
    const projectFulfilled = !!projectPermissions.find(
      (pp) => pp.id === requiredProjectPermission.id
    );

    if (globalFulfilled || projectFulfilled) return next();

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
