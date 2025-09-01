import { NextFunction, Request, Response, Router } from "express";
import projectRoleMiddleware from "../middlewares/projectRoleMiddleware";
import { GLOBAL_PERMISSIONS } from "../constants/globalPermissions";
import { PROJECT_PERMISSIONS } from "../constants/projectPermissions";
import addProjectTagValidation from "../validations/addProjectTag";
import tagsController from "../controllers/tagsController";
import removeProjectTagValidation from "../validations/removeProjectTag";

const tagsRouter = Router();

tagsRouter.post(
  "/",
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

tagsRouter.delete(
  "/:tagID",
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

export default tagsRouter;
