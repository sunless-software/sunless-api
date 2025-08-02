import { Router } from "express";
import usersController from "../controllers/usersController";

const usersRouter = Router();

usersRouter.get("/users", usersController.getUsers);

export default usersRouter;
