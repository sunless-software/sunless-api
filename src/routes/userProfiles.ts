import { Router } from "express";
import updateUserProfileValidation from "../validations/updateUserProfile";
import userProfilesController from "../controllers/userProfilesController";
import ownershipMiddleware from "../middlewares/ownershipMiddleware";
import { GLOBAL_PERMISSIONS } from "../constants/globalPermissions";

const userProfilesRouter = Router({ mergeParams: true });

userProfilesRouter.patch(
  "/",
  ownershipMiddleware(
    GLOBAL_PERMISSIONS.updateOwnProfile,
    GLOBAL_PERMISSIONS.updateProfiles
  ),
  updateUserProfileValidation,
  userProfilesController.updateUserProfile
);

export default userProfilesRouter;
