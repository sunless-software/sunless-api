import { Request, Response, NextFunction, Router } from "express";
import projectRoleMiddleware from "../middlewares/projectRoleMiddleware";
import { GLOBAL_PERMISSIONS } from "../constants/globalPermissions";
import { PROJECT_PERMISSIONS } from "../constants/projectPermissions";
import createProjectMediaValidation from "../validations/createProjectMedia";
import projectsMediaController from "../controllers/projectsMediaController";
import updateProjectMediaValidation from "../validations/updateProjectMedia";
import deleteProjectMediaValidation from "../validations/deleteProjectMedia";

const projectsMediaRouter = Router();

projectsMediaRouter.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    const projectID = parseInt(req.params.projectID) || 0;
    projectRoleMiddleware(
      GLOBAL_PERMISSIONS.createProjectMedia,
      PROJECT_PERMISSIONS.createProjectMedia,
      projectID
    )(req, res, next);
  },
  createProjectMediaValidation,
  projectsMediaController.createProjectMedia
);

projectsMediaRouter.patch(
  "/:mediaID",
  async (req: Request, res: Response, next: NextFunction) => {
    const projectID = parseInt(req.params.projectID) || 0;
    projectRoleMiddleware(
      GLOBAL_PERMISSIONS.updateProjectsMedia,
      PROJECT_PERMISSIONS.updateProjectMedia,
      projectID
    )(req, res, next);
  },
  updateProjectMediaValidation,
  projectsMediaController.updateProjectMedia
);

projectsMediaRouter.delete(
  "/:mediaID",
  async (req: Request, res: Response, next: NextFunction) => {
    const projectID = parseInt(req.params.projectID) || 0;
    projectRoleMiddleware(
      GLOBAL_PERMISSIONS.deleteProjectsMedia,
      PROJECT_PERMISSIONS.deleteProjectMedia,
      projectID
    )(req, res, next);
  },
  deleteProjectMediaValidation,
  projectsMediaController.deleteProjectMedia
);

export default projectsMediaRouter;
