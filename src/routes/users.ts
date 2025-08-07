import { Router } from "express";
import usersController from "../controllers/usersController";
import roleMiddleware from "../middlewares/roleMiddleware";
import { PERMISSIONS } from "../constants/constants";
import createUserValidation from "../validations/createUser";

const usersRouter = Router();

usersRouter.post(
  "/create",
  roleMiddleware([PERMISSIONS.createUsersGlobal]),
  createUserValidation,
  usersController.createUsers
);
usersRouter.get("/list", roleMiddleware(), usersController.getUsers);

export default usersRouter;
