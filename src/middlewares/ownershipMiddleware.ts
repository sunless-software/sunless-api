import { NextFunction, Request, Response } from "express";
import { AuthRequest, Permission } from "../interfaces";
import roleMiddleware from "./roleMiddleware";

/**
 * This midlewares gets the userID from the request params.
 *
 * If the userID from params is the same as the user who is making the request
 * it assumes the resource is from your ownership so it requires 'ownPermission',
 * otherwise it requires otherPermission
 *
 * @param ownPermission - The required global permissions if the resources is from your ownership.
 * @param otherPermission - The required global permission if the resources is not from your ownership.
 * @returns - A middleware function.
 */
export default function ownershipMiddleware(
  ownPermission: Permission,
  otherPermission: Permission
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const resourceOwnerID = parseInt(req.params.userID) || 0;
    const userID = (req as AuthRequest).user.id;
    const isOwner = resourceOwnerID === userID;

    if (isOwner) {
      return roleMiddleware([ownPermission])(req, res, next);
    }

    return roleMiddleware([otherPermission])(req, res, next);
  };
}
