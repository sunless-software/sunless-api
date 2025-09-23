import { Router } from "express";
import projectRolesController from "../controllers/projectRolesController";
import createProjectRoleValidation from "../validations/createProjectRole";
import roleMiddleware from "../middlewares/roleMiddleware";
import { GLOBAL_PERMISSIONS } from "../constants/globalPermissions";
import updateProjectRoleValidation from "../validations/updateProjectRole";

const projectRolesRouter = Router();

projectRolesRouter.post(
  "/",
  roleMiddleware([GLOBAL_PERMISSIONS.createProjectRoles]),
  createProjectRoleValidation,
  projectRolesController.createProjectRole
);

projectRolesRouter.patch(
  "/:roleID",
  roleMiddleware([GLOBAL_PERMISSIONS.updateProjectRoles]),
  updateProjectRoleValidation,
  projectRolesController.updateProjectRole
);

export default projectRolesRouter;
