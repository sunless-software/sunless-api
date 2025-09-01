import { Request, Response, NextFunction, Router } from "express";
import projectRoleMiddleware from "../middlewares/projectRoleMiddleware";
import { GLOBAL_PERMISSIONS } from "../constants/globalPermissions";
import { PROJECT_PERMISSIONS } from "../constants/projectPermissions";
import addExternalResourceValidation from "../validations/addExternalResource";
import externalResourcesController from "../controllers/externalResourcesController";
import updateExternalResourceValidation from "../validations/updateExternalResource";
import deleteExternalResourceValidation from "../validations/deleteExternalResource";

const externalResourceRouter = Router();

externalResourceRouter.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    const projectID = parseInt(req.params.projectID) || 0;
    projectRoleMiddleware(
      GLOBAL_PERMISSIONS.addProjectExternalResources,
      PROJECT_PERMISSIONS.addProjectExternalResources,
      projectID
    )(req, res, next);
  },
  addExternalResourceValidation,
  externalResourcesController.createExternalResource
);

externalResourceRouter.patch(
  "/:resourceID",
  async (req: Request, res: Response, next: NextFunction) => {
    const projectID = parseInt(req.params.projectID) || 0;
    projectRoleMiddleware(
      GLOBAL_PERMISSIONS.updateProjectExternalResources,
      PROJECT_PERMISSIONS.updateProjectExternalResources,
      projectID
    )(req, res, next);
  },
  updateExternalResourceValidation,
  externalResourcesController.updateExternalResource
);

externalResourceRouter.delete(
  "/:resourceID",
  async (req: Request, res: Response, next: NextFunction) => {
    const projectID = parseInt(req.params.projectID) || 0;
    projectRoleMiddleware(
      GLOBAL_PERMISSIONS.deleteProjectExternalResources,
      PROJECT_PERMISSIONS.deleteProjectExternalResources,
      projectID
    )(req, res, next);
  },
  deleteExternalResourceValidation,
  externalResourcesController.deleteProjectExternalResource
);

export default externalResourceRouter;
