import { Router } from "express";
import getSkillsValidation from "../validations/getSkills";
import skillsController from "../controllers/skillsController";
import createSkillValidations from "../validations/createSkill";
import roleMiddleware from "../middlewares/roleMiddleware";
import { GLOBAL_PERMISSIONS } from "../constants/globalPermissions";

const skillsRouter = Router({ mergeParams: true });

skillsRouter.get("/", getSkillsValidation, skillsController.getSkills);

skillsRouter.post(
  "/",
  roleMiddleware([GLOBAL_PERMISSIONS.createSkills]),
  createSkillValidations,
  skillsController.createSkill
);

export default skillsRouter;
