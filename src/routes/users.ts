import { Router } from "express";
import usersController from "../controllers/usersController";
import roleMiddleware from "../middlewares/roleMiddleware";

const usersRouter = Router();

usersRouter.get("/list", roleMiddleware, usersController.getUsers);

export default usersRouter;
