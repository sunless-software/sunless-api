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
import getUserDetailsValidation from "../validations/getUserDetails";
import conditionalQueryMiddleware from "../middlewares/conditionalQueryMiddleware";

const usersRouter = Router();

usersRouter.get(
  "/list",
  conditionalQueryMiddleware([
    {
      queryKey: "showPrivateUsers",
      relatedPermission: GLOBAL_PERMISSIONS.viewPrivateUsers,
      appliesToOwner: true,
    },
    {
      queryKey: "showDeletedUsers",
      relatedPermission: GLOBAL_PERMISSIONS.viewDeletedUsers,
      appliesToOwner: true,
    },
  ]),
  getUsersValidation,
  usersController.getUsers
);

usersRouter.get(
  "/:id",
  conditionalQueryMiddleware([
    {
      queryKey: "showPrivateUsers",
      relatedPermission: GLOBAL_PERMISSIONS.getPrivateUserDetails,
      appliesToOwner: false,
    },
    {
      queryKey: "showDeletedUsers",
      relatedPermission: GLOBAL_PERMISSIONS.getDeletedUserDetails,
      appliesToOwner: true,
    },
  ]),
  getUserDetailsValidation,
  usersController.getUserDetails
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
