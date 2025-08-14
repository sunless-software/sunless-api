import { NextFunction, Request, Response, Router } from "express";
import usersController from "../controllers/usersController";
import roleMiddleware from "../middlewares/roleMiddleware";
import { GLOBAL_PERMISSIONS } from "../constants/globalPermissions";
import createUserValidation from "../validations/createUser";
import getUsersValidation from "../validations/getUsers";

const usersRouter = Router();

usersRouter.get(
  "/list",
  getUsersValidation,
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      showPrivateUsers = false,
      showBannedUsers = false,
      showDeletedUsers = false,
    } = req.query;

    const requiredPermissions = [
      ...(showPrivateUsers ? [GLOBAL_PERMISSIONS.viewPrivateUsers] : []),
      ...(showBannedUsers ? [GLOBAL_PERMISSIONS.viewBannedUsers] : []),
      ...(showDeletedUsers ? [GLOBAL_PERMISSIONS.viewDeletedUsers] : []),
    ];

    if (!requiredPermissions.length) return next();

    return roleMiddleware([], requiredPermissions)(req, res, next);
  },
  usersController.getUsers
);

usersRouter.post(
  "/create",
  roleMiddleware([GLOBAL_PERMISSIONS.createUsers]),
  createUserValidation,
  usersController.createUsers
);

export default usersRouter;
