import { Router } from "express";
import projectRoleMiddleware from "../middlewares/projectRoleMiddleware";
import { GLOBAL_PERMISSIONS } from "../constants/globalPermissions";
import { PROJECT_PERMISSIONS } from "../constants/projectPermissions";
import addProjectTechnologyValidation from "../validations/addProjectTechnology";
import userTechnologiesController from "../controllers/userTechnologiesController";
import removeProjectTechnologyValidation from "../validations/removeProjectTechnology";

const projectsTechnologiesRouter = Router({ mergeParams: true });

projectsTechnologiesRouter.post(
  "/",
  projectRoleMiddleware(
    GLOBAL_PERMISSIONS.updateProjects,
    GLOBAL_PERMISSIONS.addTechnologies
  ),
  addProjectTechnologyValidation,
  userTechnologiesController.addProjectTechnology
);

projectsTechnologiesRouter.delete(
  "/:technologyID",
  projectRoleMiddleware(
    GLOBAL_PERMISSIONS.updateProjects,
    PROJECT_PERMISSIONS.removeTechnologies
  ),
  removeProjectTechnologyValidation,
  userTechnologiesController.removeProjectTechnology
);

export default projectsTechnologiesRouter;
