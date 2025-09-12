import { NextFunction, Request, Response, Router } from "express";
import projectRoleMiddleware from "../middlewares/projectRoleMiddleware";
import { GLOBAL_PERMISSIONS } from "../constants/globalPermissions";
import { PROJECT_PERMISSIONS } from "../constants/projectPermissions";
import addProjectTagValidation from "../validations/addProjectTag";
import tagsController from "../controllers/tagsController";
import removeProjectTagValidation from "../validations/removeProjectTag";

const tagsRouter = Router({ mergeParams: true });

tagsRouter.post(
  "/",
  projectRoleMiddleware(
    GLOBAL_PERMISSIONS.addProjectTags,
    PROJECT_PERMISSIONS.addProjectTags
  ),
  addProjectTagValidation,
  tagsController.addProjectTag
);

tagsRouter.delete(
  "/:tagID",
  projectRoleMiddleware(
    GLOBAL_PERMISSIONS.removeProjectTags,
    PROJECT_PERMISSIONS.removeProjectTags
  ),
  removeProjectTagValidation,
  tagsController.removeProjectTag
);

export default tagsRouter;
