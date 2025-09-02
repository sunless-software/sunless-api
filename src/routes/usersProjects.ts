import { Router } from "express";
import projectsController from "../controllers/projectsController";
import getProjectsFromUserValidation from "../validations/getProjectsFromUser";
import roleMiddleware from "../middlewares/roleMiddleware";
import { GLOBAL_PERMISSIONS } from "../constants/globalPermissions";

const usersProjectsRouter = Router({ mergeParams: true });

usersProjectsRouter.get(
  "/",
  roleMiddleware([GLOBAL_PERMISSIONS.readProjects]),
  getProjectsFromUserValidation,
  projectsController.getProjectFromUser
);

export default usersProjectsRouter;
