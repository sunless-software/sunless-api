import { NextFunction, Request, Response, Router } from "express";
import projectsController from "../controllers/projectsController";
import createProjectsValidation from "../validations/createProject";
import roleMiddleware from "../middlewares/roleMiddleware";
import { GLOBAL_PERMISSIONS } from "../constants/globalPermissions";

const projectsRouter = Router();

//
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

export default projectsRouter;
