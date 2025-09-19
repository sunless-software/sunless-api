import { Router } from "express";
import globalRolesController from "../controllers/globalRolesController";
import createGlobalRoleValidation from "../validations/createGlobalRole";
import roleMiddleware from "../middlewares/roleMiddleware";
import { GLOBAL_PERMISSIONS } from "../constants/globalPermissions";
import updateGlobalRoleValidation from "../validations/updateglobalRole";

const globalRolesRouter = Router();

globalRolesRouter.post(
  "/",
  roleMiddleware([GLOBAL_PERMISSIONS.createGlobalRoles]),
  createGlobalRoleValidation,
  globalRolesController.createGlobalRole
);

globalRolesRouter.patch(
  "/:roleID",
  roleMiddleware([GLOBAL_PERMISSIONS.updateGlobalRoles]),
  updateGlobalRoleValidation,
  globalRolesController.updateGlobalRole
);

export default globalRolesRouter;
