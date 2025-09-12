import { Router } from "express";
import projectRoleMiddleware from "../middlewares/projectRoleMiddleware";
import { GLOBAL_PERMISSIONS } from "../constants/globalPermissions";
import { PROJECT_PERMISSIONS } from "../constants/projectPermissions";
import createProjectMediaValidation from "../validations/createProjectMedia";
import projectsMediaController from "../controllers/projectsMediaController";
import updateProjectMediaValidation from "../validations/updateProjectMedia";
import deleteProjectMediaValidation from "../validations/deleteProjectMedia";

const projectsMediaRouter = Router({ mergeParams: true });

projectsMediaRouter.post(
  "/",
  projectRoleMiddleware(
    GLOBAL_PERMISSIONS.createProjectMedia,
    PROJECT_PERMISSIONS.createProjectMedia
  ),
  createProjectMediaValidation,
  projectsMediaController.createProjectMedia
);

projectsMediaRouter.patch(
  "/:mediaID",
  projectRoleMiddleware(
    GLOBAL_PERMISSIONS.updateProjectsMedia,
    PROJECT_PERMISSIONS.updateProjectMedia
  ),
  updateProjectMediaValidation,
  projectsMediaController.updateProjectMedia
);

projectsMediaRouter.delete(
  "/:mediaID",
  projectRoleMiddleware(
    GLOBAL_PERMISSIONS.deleteProjectsMedia,
    PROJECT_PERMISSIONS.deleteProjectMedia
  ),
  deleteProjectMediaValidation,
  projectsMediaController.deleteProjectMedia
);

export default projectsMediaRouter;
