import { Router } from "express";
import getTechnologiesValidation from "../validations/getTechnologies";
import technologiesController from "../controllers/technologiesController";
import createTechnologyValidation from "../validations/createTechnology";
import roleMiddleware from "../middlewares/roleMiddleware";
import { GLOBAL_PERMISSIONS } from "../constants/globalPermissions";
import updateTechnologyValidation from "../validations/updateTechnology";

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

technologiesRouter.patch(
  "/:technologyID",
  updateTechnologyValidation,
  roleMiddleware([GLOBAL_PERMISSIONS.updateTechnologies]),
  technologiesController.updateTechnology
);

export default technologiesRouter;
