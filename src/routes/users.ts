import { NextFunction, Request, Response, Router } from "express";
import usersController from "../controllers/usersController";
import roleMiddleware from "../middlewares/roleMiddleware";
import { GLOBAL_PERMISSIONS } from "../constants/globalPermissions";
import createUserValidation from "../validations/createUser";
import getUsersValidation from "../validations/getUsers";
import deleteUserValidation from "../validations/deleteUser";
import banUserValidation from "../validations/banUser";
import unbanUserValidation from "../validations/unbanUser";
import recoverUserValidation from "../validations/recoverUser";
import { AuthRequest } from "../interfaces";
import updateUserRoleValidation from "../validations/updateUserRole";
import updateUserValidation from "../validations/updateUser";

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

usersRouter.delete(
  "/delete/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as AuthRequest).user;
    const { id } = req.params;

    if (id === user.id.toString()) {
      return next();
    }

    return roleMiddleware([GLOBAL_PERMISSIONS.deleteUsers])(req, res, next);
  },
  deleteUserValidation,
  usersController.deleteUser
);

usersRouter.patch(
  "/recover/:id",
  roleMiddleware([GLOBAL_PERMISSIONS.recoverUsers]),
  recoverUserValidation,
  usersController.recoverUser
);

usersRouter.patch(
  `/ban/:id`,
  roleMiddleware([GLOBAL_PERMISSIONS.banUsers]),
  banUserValidation,
  usersController.banUser
);

usersRouter.patch(
  `/unban/:id`,
  roleMiddleware([GLOBAL_PERMISSIONS.unbanUsers]),
  unbanUserValidation,
  usersController.unbanUser
);

usersRouter.patch(
  `/role/:id`,
  roleMiddleware([GLOBAL_PERMISSIONS.manageUserRoles]),
  updateUserRoleValidation,
  usersController.updateRole
);

usersRouter.patch(
  `/:id`,
  async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as AuthRequest).user;
    const { id } = req.params;

    if (id === user.id.toString()) {
      return roleMiddleware([GLOBAL_PERMISSIONS.updateOwnUser])(req, res, next);
    }

    return roleMiddleware([GLOBAL_PERMISSIONS.updateUsers])(req, res, next);
  },
  updateUserValidation,
  usersController.updateUser
);

export default usersRouter;
