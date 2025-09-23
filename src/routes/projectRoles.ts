import { Router } from "express";
import projectRolesController from "../controllers/projectRolesController";
import createProjectRoleValidation from "../validations/createProjectRole";
import roleMiddleware from "../middlewares/roleMiddleware";
import { GLOBAL_PERMISSIONS } from "../constants/globalPermissions";

const projectRolesRouter = Router();

projectRolesRouter.post(
  "/",
  roleMiddleware([GLOBAL_PERMISSIONS.createProjectRoles]),
  createProjectRoleValidation,
  projectRolesController.createProjectRole
);

export default projectRolesRouter;
