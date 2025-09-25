import { Router } from "express";
import permissionsController from "../controllers/permissionsController";
import getPermissionsValidation from "../validations/getPermissions";
import roleMiddleware from "../middlewares/roleMiddleware";
import { GLOBAL_PERMISSIONS } from "../constants/globalPermissions";

const permissionsRouter = Router();

permissionsRouter.get(
  "/",
  roleMiddleware([GLOBAL_PERMISSIONS.listPermissions]),
  getPermissionsValidation,
  permissionsController.getPermissions
);

export default permissionsRouter;
