import { Router } from "express";
import usersController from "../controllers/usersController";
import roleMiddleware from "../middlewares/roleMiddleware";
import { GLOBAL_PERMISSIONS } from "../constants/globalPermissions";
import createUserValidation from "../validations/createUser";
import getUsersValidation from "../validations/getUsers";
import deleteUserValidation from "../validations/deleteUser";
import banUserValidation from "../validations/banUser";
import unbanUserValidation from "../validations/unbanUser";
import recoverUserValidation from "../validations/recoverUser";
import updateUserRoleValidation from "../validations/updateUserRole";
import updateUserValidation from "../validations/updateUser";
import getUserDetailsValidation from "../validations/getUserDetails";
import conditionalQueryMiddleware from "../middlewares/conditionalQueryMiddleware";
import ownershipMiddleware from "../middlewares/ownershipMiddleware";
import updateOwnPasswordValidation from "../validations/updateOwnPassword";
import updatePasswordValidation from "../validations/updatePassword";

const usersRouter = Router();

usersRouter.get(
  "/",
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

usersRouter.patch(
  "/change-password",
  updateOwnPasswordValidation,
  usersController.changePassword
);

usersRouter.patch(
  "/change-password/:userID",
  roleMiddleware([GLOBAL_PERMISSIONS.updateUsersPassword]),
  updatePasswordValidation,
  usersController.changePassword
);

usersRouter.post(
  "/",
  roleMiddleware([GLOBAL_PERMISSIONS.createUsers]),
  createUserValidation,
  usersController.createUsers
);

usersRouter.get(
  "/:userID",
  conditionalQueryMiddleware([
    {
      queryKey: "showPrivateUsers",
      relatedPermission: GLOBAL_PERMISSIONS.getPrivateUserDetails,
      appliesToOwner: false,
    },
    {
      queryKey: "showDeletedUsers",
      relatedPermission: GLOBAL_PERMISSIONS.getDeletedUserDetails,
      appliesToOwner: false,
    },
  ]),
  getUserDetailsValidation,
  usersController.getUserDetails
);

usersRouter.delete(
  "/:userID",
  ownershipMiddleware(null, GLOBAL_PERMISSIONS.deleteUsers),
  deleteUserValidation,
  usersController.deleteUser
);

usersRouter.patch(
  `/:userID`,
  ownershipMiddleware(
    GLOBAL_PERMISSIONS.updateOwnUser,
    GLOBAL_PERMISSIONS.updateUsers
  ),
  updateUserValidation,
  usersController.updateUser
);

usersRouter.patch(
  "/recover/:userID",
  roleMiddleware([GLOBAL_PERMISSIONS.recoverUsers]),
  recoverUserValidation,
  usersController.recoverUser
);

usersRouter.patch(
  `/ban/:userID`,
  roleMiddleware([GLOBAL_PERMISSIONS.banUsers]),
  banUserValidation,
  usersController.banUser
);

usersRouter.patch(
  `/unban/:userID`,
  ownershipMiddleware(
    GLOBAL_PERMISSIONS.unbanOwnUser,
    GLOBAL_PERMISSIONS.unbanUsers
  ),
  unbanUserValidation,
  usersController.unbanUser
);

usersRouter.patch(
  `/:userID/role`,
  roleMiddleware([GLOBAL_PERMISSIONS.manageUserRoles]),
  updateUserRoleValidation,
  usersController.updateRole
);

export default usersRouter;
