import { Router } from "express";
import usersController from "../controllers/usersController";
import roleMiddleware from "../middlewares/roleMiddleware";
import { PERMISSIONS } from "../constants/constants";

const usersRouter = Router();

usersRouter.get(
  "/list",
  roleMiddleware(
    [],
    [PERMISSIONS.createUsersGlobal, PERMISSIONS.banUsersGlobal]
  ),
  usersController.getUsers
);

export default usersRouter;
