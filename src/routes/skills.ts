import { Router } from "express";
import getSkillsValidation from "../validations/getSkills";
import skillsController from "../controllers/skillsController";

const skillsRouter = Router({ mergeParams: true });

skillsRouter.get("/", getSkillsValidation, skillsController.getSkills);

export default skillsRouter;
