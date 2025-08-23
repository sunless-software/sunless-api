import { Router } from "express";
import skillsController from "../controllers/skillsController";
import addUserSkillValidation from "../validations/addUserSkill";
import ownershipMiddleware from "../middlewares/ownershipMiddleware";
import { GLOBAL_PERMISSIONS } from "../constants/globalPermissions";
import removeUserSkillValidation from "../validations/removeUserSkill";
import getSkillsValidation from "../validations/getSkills";

const skillsRouter = Router();

skillsRouter.get("/", getSkillsValidation, skillsController.getSkills);

skillsRouter.post(
  "/add",
  ownershipMiddleware(
    "body",
    GLOBAL_PERMISSIONS.addOwnSkills,
    GLOBAL_PERMISSIONS.addSkills
  ),
  addUserSkillValidation,
  skillsController.addSkill
);

skillsRouter.delete(
  "/remove/:id",
  ownershipMiddleware(
    "query",
    GLOBAL_PERMISSIONS.removeOwnSkills,
    GLOBAL_PERMISSIONS.removeSkills
  ),
  removeUserSkillValidation,
  skillsController.removeSkill
);

export default skillsRouter;
