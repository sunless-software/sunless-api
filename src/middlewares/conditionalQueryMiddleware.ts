import { NextFunction, Request, Response } from "express";
import { AuthRequest, Permission } from "../interfaces";
import roleMiddleware from "./roleMiddleware";

/**
 * Receives a list of objects containing the key of the query to be received. If the value is thruty
 * and appliesToOwner is true adds as required the related permissions. If appliesToOwner is false and
 * the id in params is the same as the user you are currently logged in the permissions will not be added as
 * required. After that calls roleMiddleware to check if the user has all the required permissions.
 *
 * @param queryPermissions - A list of keys and related permissions in the query.
 * @returns - A middleware function.
 */
export default function conditionalQueryMiddleware(
  queryPermissions: Array<{
    queryKey: string;
    relatedPermission: Permission;
    appliesToOwner: boolean;
  }>
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authID = (req as AuthRequest).user.id;
    const resourceID = req.params.id;
    const isOwnResource = authID === parseInt(resourceID);

    const requiredPermissions = queryPermissions
      .map((q) => {
        const queryValue = req.query[q.queryKey] || false;

        if (queryValue) {
          if (q.appliesToOwner === false && isOwnResource) return;
          return q.relatedPermission;
        }
      })
      .filter((v) => !!v);

    if (!requiredPermissions.length) return next();

    return roleMiddleware([], requiredPermissions)(req, res, next);
  };
}
