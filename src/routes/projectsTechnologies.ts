import { NextFunction, Request, Response, Router } from "express";
import projectRoleMiddleware from "../middlewares/projectRoleMiddleware";
import { GLOBAL_PERMISSIONS } from "../constants/globalPermissions";
import { PROJECT_PERMISSIONS } from "../constants/projectPermissions";
import addProjectTechnologyValidation from "../validations/addProjectTechnology";
import userTechnologiesController from "../controllers/userTechnologiesController";
import removeProjectTechnologyValidation from "../validations/removeProjectTechnology";

const projectsTechnologiesRouter = Router({ mergeParams: true });

projectsTechnologiesRouter.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    const projectID = parseInt(req.params.projectID) || 0;
    projectRoleMiddleware(
      GLOBAL_PERMISSIONS.updateProjects,
      PROJECT_PERMISSIONS.addTechnologies,
      projectID
    )(req, res, next);
  },
  addProjectTechnologyValidation,
  userTechnologiesController.addProjectTechnology
);

projectsTechnologiesRouter.delete(
  "/",
  (req: Request, res: Response, next: NextFunction) => {
    const projectID = parseInt(req.params.projectID) || 0;

    projectRoleMiddleware(
      GLOBAL_PERMISSIONS.updateProjects,
      PROJECT_PERMISSIONS.removeTechnologies,
      projectID || 0
    )(req, res, next);
  },
  removeProjectTechnologyValidation,
  userTechnologiesController.removeProjectTechnology
);

export default projectsTechnologiesRouter;
