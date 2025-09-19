import { Router } from "express";
import globalRolesController from "../controllers/globalRolesController";
import createGlobalRoleValidation from "../validations/createGlobalRole";
import roleMiddleware from "../middlewares/roleMiddleware";
import { GLOBAL_PERMISSIONS } from "../constants/globalPermissions";

const globalRolesRouter = Router();

globalRolesRouter.post(
  "/",
  roleMiddleware([GLOBAL_PERMISSIONS.createGlobalRoles]),
  createGlobalRoleValidation,
  globalRolesController.createGlobalRole
);

export default globalRolesRouter;
