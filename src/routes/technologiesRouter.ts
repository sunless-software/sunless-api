import { Router } from "express";
import getTechnologiesValidation from "../validations/getTechnologies";
import technologiesController from "../controllers/technologiesController";
import createTechnologyValidation from "../validations/createTechnology";
import roleMiddleware from "../middlewares/roleMiddleware";
import { GLOBAL_PERMISSIONS } from "../constants/globalPermissions";

const technologiesRouter = Router({ mergeParams: true });

technologiesRouter.get(
  "/",
  getTechnologiesValidation,
  technologiesController.getTechnologies
);

technologiesRouter.post(
  "/",
  roleMiddleware([GLOBAL_PERMISSIONS.createTechnologies]),
  createTechnologyValidation,
  technologiesController.createTechnology
);

export default technologiesRouter;
