import { Router } from "express";
import skillsController from "../controllers/skillsController";
import addUserSkillValidation from "../validations/addUserSkill";
import ownershipMiddleware from "../middlewares/ownershipMiddleware";
import { GLOBAL_PERMISSIONS } from "../constants/globalPermissions";

const skillsRouter = Router();

skillsRouter.post(
  "/add",
  ownershipMiddleware(
    GLOBAL_PERMISSIONS.addOwnSkills,
    GLOBAL_PERMISSIONS.addSkills
  ),
  addUserSkillValidation,
  skillsController.addSkill
);

export default skillsRouter;
