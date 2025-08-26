import { NextFunction, Request, Response, Router } from "express";
import projectsController from "../controllers/projectsController";
import createProjectsValidation from "../validations/createProject";
import roleMiddleware from "../middlewares/roleMiddleware";
import { GLOBAL_PERMISSIONS } from "../constants/globalPermissions";
import deleteProjectValidation from "../validations/deleteProject";
import projectRoleMiddleware from "../middlewares/projectRoleMiddleware";
import { PROJECT_PERMISSIONS } from "../constants/projectPermissions";

const projectsRouter = Router();

projectsRouter.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.publicProject)
      return roleMiddleware([GLOBAL_PERMISSIONS.createPrivateProjects])(
        req,
        res,
        next
      );
    return roleMiddleware([GLOBAL_PERMISSIONS.createPublicProjects])(
      req,
      res,
      next
    );
  },
  createProjectsValidation,
  projectsController.createProject
);

projectsRouter.delete(
  "/:id",
  (req: Request, res: Response, next: NextFunction) => {
    const projectID = parseInt(req.params.id);
    projectRoleMiddleware(
      GLOBAL_PERMISSIONS.deleteProjects,
      PROJECT_PERMISSIONS.deleteProject,
      projectID
    )(req, res, next);
  },
  deleteProjectValidation,
  projectsController.deleteProject
);

export default projectsRouter;
