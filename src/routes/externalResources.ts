import { Router } from "express";
import projectRoleMiddleware from "../middlewares/projectRoleMiddleware";
import { GLOBAL_PERMISSIONS } from "../constants/globalPermissions";
import { PROJECT_PERMISSIONS } from "../constants/projectPermissions";
import addExternalResourceValidation from "../validations/addExternalResource";
import externalResourcesController from "../controllers/externalResourcesController";
import updateExternalResourceValidation from "../validations/updateExternalResource";
import deleteExternalResourceValidation from "../validations/deleteExternalResource";

const externalResourceRouter = Router({ mergeParams: true });

// TODO: Revisar
externalResourceRouter.post(
  "/",
  projectRoleMiddleware(
    GLOBAL_PERMISSIONS.addProjectExternalResources,
    PROJECT_PERMISSIONS.addProjectExternalResources
  ),
  addExternalResourceValidation,
  externalResourcesController.createExternalResource
);

// TODO: Revisar
externalResourceRouter.patch(
  "/:resourceID",
  projectRoleMiddleware(
    GLOBAL_PERMISSIONS.updateProjectExternalResources,
    PROJECT_PERMISSIONS.updateProjectExternalResources
  ),
  updateExternalResourceValidation,
  externalResourcesController.updateExternalResource
);

// TODO: Revisar
externalResourceRouter.delete(
  "/:resourceID",
  projectRoleMiddleware(
    GLOBAL_PERMISSIONS.deleteProjectExternalResources,
    PROJECT_PERMISSIONS.deleteProjectExternalResources
  ),
  deleteExternalResourceValidation,
  externalResourcesController.deleteProjectExternalResource
);

export default externalResourceRouter;
