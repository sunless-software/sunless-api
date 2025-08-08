import { NextFunction, Request, Response, Router } from "express";
import usersController from "../controllers/usersController";
import roleMiddleware from "../middlewares/roleMiddleware";
import { PERMISSIONS } from "../constants/constants";
import createUserValidation from "../validations/createUser";

const usersRouter = Router();

usersRouter.get(
  "/list",
  async (req: Request, res: Response, next: NextFunction) => {
    const { showPrivateUsers = false } = req.body;
    if (!showPrivateUsers) return next();
    roleMiddleware([PERMISSIONS.viewPrivateUsersGlobal])(req, res, next);
  },
  usersController.getUsers
);

usersRouter.post(
  "/create",
  roleMiddleware([PERMISSIONS.createUsersGlobal]),
  createUserValidation,
  usersController.createUsers
);

export default usersRouter;
