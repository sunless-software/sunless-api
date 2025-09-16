import { Router } from "express";
import projectRoleMiddleware from "../middlewares/projectRoleMiddleware";
import { GLOBAL_PERMISSIONS } from "../constants/globalPermissions";
import { PROJECT_PERMISSIONS } from "../constants/projectPermissions";
import addProjectTagValidation from "../validations/addProjectTag";
import projectTagsController from "../controllers/projectTagsController";
import removeProjectTagValidation from "../validations/removeProjectTag";

const projectTagsRouter = Router({ mergeParams: true });

projectTagsRouter.post(
  "/",
  projectRoleMiddleware(
    GLOBAL_PERMISSIONS.addProjectTags,
    PROJECT_PERMISSIONS.addProjectTags
  ),
  addProjectTagValidation,
  projectTagsController.addProjectTag
);

projectTagsRouter.delete(
  "/:tagID",
  projectRoleMiddleware(
    GLOBAL_PERMISSIONS.removeProjectTags,
    PROJECT_PERMISSIONS.removeProjectTags
  ),
  removeProjectTagValidation,
  projectTagsController.removeProjectTag
);

export default projectTagsRouter;
