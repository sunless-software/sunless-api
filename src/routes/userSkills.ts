import { Router } from "express";
import userSkillsController from "../controllers/userSkillsController";
import addUserSkillValidation from "../validations/addUserSkill";
import ownershipMiddleware from "../middlewares/ownershipMiddleware";
import { GLOBAL_PERMISSIONS } from "../constants/globalPermissions";
import removeUserSkillValidation from "../validations/removeUserSkill";

const userSkillsRouter = Router({ mergeParams: true });

userSkillsRouter.post(
  "/",
  ownershipMiddleware(
    GLOBAL_PERMISSIONS.addOwnSkills,
    GLOBAL_PERMISSIONS.addSkills
  ),
  addUserSkillValidation,
  userSkillsController.addSkill
);

userSkillsRouter.delete(
  "/:skillID",
  ownershipMiddleware(
    GLOBAL_PERMISSIONS.removeOwnSkills,
    GLOBAL_PERMISSIONS.removeSkills
  ),
  removeUserSkillValidation,
  userSkillsController.removeSkill
);

export default userSkillsRouter;
