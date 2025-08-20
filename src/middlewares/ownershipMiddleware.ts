import { NextFunction, Request, Response } from "express";
import { AuthRequest, Permission } from "../interfaces";
import roleMiddleware from "./roleMiddleware";

/**
 * This middleware gets the id of the owner of a resource from the body request and checks if
 * matches the id of the user which is doing the request. If the resource belong to
 * the user checks for 'ownPermission' if the resource does not belongs to the user
 * checks for 'otherPermission'.
 *
 * @param ownPermission - The permissions which will be required if the resource belong to the user.
 * @param otherPermission - The permission which will be required if the resource does not belongs to the user.
 * @returns - A middleware
 */
export default function ownershipMiddleware(
  ownPermission: Permission,
  otherPermission: Permission
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const resourceOwnerID = req.body.userID;
    const userID = (req as AuthRequest).user.id;

    if (!resourceOwnerID || resourceOwnerID === userID) {
      req.body.userID = userID;
      return roleMiddleware([ownPermission])(req, res, next);
    }

    return roleMiddleware([otherPermission])(req, res, next);
  };
}
