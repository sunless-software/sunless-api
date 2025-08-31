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
import addProjectTagValidation from "../validations/addProjectTag";
import removeProjectTagValidation from "../validations/removeProjectTag";
import addExternalResourceValidation from "../validations/addExternalResource";
import deleteExternalResourceValidation from "../validations/deleteExternalResource";
import updateExternalResourceValidation from "../validations/updateExternalResource";
import externalResourcesController from "../controllers/externalResourcesController";
import tagsController from "../controllers/tagsController";
import projectsMediaController from "../controllers/projectsMediaController";
import createProjectMediaValidation from "../validations/createProjectMedia";
import deleteProjectMediaValidation from "../validations/deleteProjectMedia";
import updateProjectMediaValidation from "../validations/updateProjectMedia";

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

projectsRouter.patch(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const projectID = parseInt(req.params.id);
    return projectRoleMiddleware(
      GLOBAL_PERMISSIONS.updateProjects,
      PROJECT_PERMISSIONS.updateProjects,
      projectID
    )(req, res, next);
  },
  async (req: Request, res: Response, next: NextFunction) => {
    const { publicProject } = req.body;
    if (publicProject === undefined) return next();
    const projectID = parseInt(req.params.id);

    if (publicProject) {
      return projectRoleMiddleware(
        GLOBAL_PERMISSIONS.createPublicProjects,
        PROJECT_PERMISSIONS.setPublicProject,
        projectID
      )(req, res, next);
    }

    return projectRoleMiddleware(
      GLOBAL_PERMISSIONS.createPrivateProjects,
      PROJECT_PERMISSIONS.setPrivateProject,
      projectID
    )(req, res, next);
  },
  updateProjectsValidation,
  projectsController.updateProject
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

projectsRouter.post(
  "/invite/:id",
  (req: Request, res: Response, next: NextFunction) => {
    const projectID = parseInt(req.params.id);
    projectRoleMiddleware(
      GLOBAL_PERMISSIONS.inviteProjects,
      PROJECT_PERMISSIONS.inviteProject,
      projectID
    )(req, res, next);
  },
  createProjectInvitationValidation,
  projectsController.createProjectInvitation
);

projectsRouter.post(
  "/join",
  acceptInvitationValidation,
  projectsController.acceptProjectInvitation
);

projectsRouter.post(
  "/:id/tags",
  async (req: Request, res: Response, next: NextFunction) => {
    const projectID = parseInt(req.params.id) || 0;
    projectRoleMiddleware(
      GLOBAL_PERMISSIONS.addProjectTags,
      PROJECT_PERMISSIONS.addProjectTags,
      projectID
    )(req, res, next);
  },
  addProjectTagValidation,
  tagsController.addProjectTag
);

projectsRouter.delete(
  "/:projectID/tags/:tagID",
  async (req: Request, res: Response, next: NextFunction) => {
    const projectID = parseInt(req.params.projectID) || 0;
    projectRoleMiddleware(
      GLOBAL_PERMISSIONS.removeProjectTags,
      PROJECT_PERMISSIONS.removeProjectTags,
      projectID
    )(req, res, next);
  },
  removeProjectTagValidation,
  tagsController.removeProjectTag
);

projectsRouter.post(
  "/:projectID/external-resources",
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

projectsRouter.patch(
  "/:projectID/external-resources/:resourceID",
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

projectsRouter.delete(
  "/:projectID/external-resources/:resourceID",
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

projectsRouter.post(
  "/:projectID/media",
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

projectsRouter.patch(
  "/:projectID/media/:mediaID",
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

projectsRouter.delete(
  "/:projectID/media/:mediaID",
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

export default projectsRouter;
