import { NextFunction, Request, Response, Router } from "express";
import projectsController from "../controllers/projectsController";
import createProjectsValidation from "../validations/createProject";
import roleMiddleware from "../middlewares/roleMiddleware";
import { GLOBAL_PERMISSIONS } from "../constants/globalPermissions";
import deleteProjectValidation from "../validations/deleteProject";
import projectRoleMiddleware from "../middlewares/projectRoleMiddleware";
import { PROJECT_PERMISSIONS } from "../constants/projectPermissions";
import updateProjectsValidation from "../validations/updateProject";
import createProjectInvitationValidation from "../validations/createProjectInvitation";
import acceptInvitationValidation from "../validations/acceptInvitation";
import getProjectsValidation from "../validations/getProjects";
import getProjectDetailsValidation from "../validations/getProjectDetails";

const projectsRouter = Router();

projectsRouter.get(
  "/",
  roleMiddleware([GLOBAL_PERMISSIONS.readProjects]),
  getProjectsValidation,
  projectsController.getProjects
);

projectsRouter.get(
  "/:projectID",
  projectRoleMiddleware(
    GLOBAL_PERMISSIONS.getProjectDetails,
    PROJECT_PERMISSIONS.getProjectDetails
  ),
  getProjectDetailsValidation,
  projectsController.getProjectDetails
);

projectsRouter.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.publicProject)
      return roleMiddleware([GLOBAL_PERMISSIONS.createPublicProjects])(
        req,
        res,
        next
      );
    return roleMiddleware([GLOBAL_PERMISSIONS.createPrivateProjects])(
      req,
      res,
      next
    );
  },
  createProjectsValidation,
  projectsController.createProject
);

projectsRouter.patch(
  "/:projectID",
  projectRoleMiddleware(
    GLOBAL_PERMISSIONS.updateProjects,
    PROJECT_PERMISSIONS.updateProjects
  ),
  async (req: Request, res: Response, next: NextFunction) => {
    const { publicProject } = req.body;
    if (publicProject === undefined) return next();

    if (publicProject) {
      return projectRoleMiddleware(
        GLOBAL_PERMISSIONS.createPublicProjects,
        PROJECT_PERMISSIONS.setPublicProject
      )(req, res, next);
    }

    return projectRoleMiddleware(
      GLOBAL_PERMISSIONS.createPrivateProjects,
      PROJECT_PERMISSIONS.setPrivateProject
    )(req, res, next);
  },
  updateProjectsValidation,
  projectsController.updateProject
);

projectsRouter.delete(
  "/:projectID",
  projectRoleMiddleware(
    GLOBAL_PERMISSIONS.deleteProjects,
    PROJECT_PERMISSIONS.deleteProject
  ),
  deleteProjectValidation,
  projectsController.deleteProject
);

projectsRouter.post(
  "/invite/:projectID",
  projectRoleMiddleware(
    GLOBAL_PERMISSIONS.inviteProjects,
    PROJECT_PERMISSIONS.inviteProject
  ),
  createProjectInvitationValidation,
  projectsController.createProjectInvitation
);

projectsRouter.post(
  "/join",
  acceptInvitationValidation,
  projectsController.acceptProjectInvitation
);

export default projectsRouter;
