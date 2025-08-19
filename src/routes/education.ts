import { Request, Response, NextFunction, Router } from "express";
import educationController from "../controllers/educationController";
import { AuthRequest } from "../interfaces";
import roleMiddleware from "../middlewares/roleMiddleware";
import { GLOBAL_PERMISSIONS } from "../constants/globalPermissions";
import createEducationValidation from "../validations/createEducation";

const educationRouter = Router();

educationRouter.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as AuthRequest).user;
    const { userID } = req.body;

    if (!userID || userID === user.id) {
      req.body.userID = user.id;

      return roleMiddleware([GLOBAL_PERMISSIONS.createOwnEducations])(
        req,
        res,
        next
      );
    }

    return roleMiddleware([GLOBAL_PERMISSIONS.createEducations])(
      req,
      res,
      next
    );
  },
  createEducationValidation,
  educationController.createEducation
);

export default educationRouter;
