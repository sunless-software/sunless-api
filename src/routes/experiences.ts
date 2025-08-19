import { Request, Response, NextFunction, Router } from "express";
import createExperienceValidation from "../validations/createExperience";
import experiencesController from "../controllers/experiences";
import { AuthRequest } from "../interfaces";
import roleMiddleware from "../middlewares/roleMiddleware";
import { GLOBAL_PERMISSIONS } from "../constants/globalPermissions";

const experiencesRouter = Router();

experiencesRouter.post(
  "/create",
  async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as AuthRequest).user;
    const { userID } = req.body;

    if (userID === user.id) {
      return roleMiddleware([GLOBAL_PERMISSIONS.createOwnExperiences])(
        req,
        res,
        next
      );
    }

    return roleMiddleware([GLOBAL_PERMISSIONS.createExperiences])(
      req,
      res,
      next
    );
  },
  createExperienceValidation,
  experiencesController.createExperience
);

export default experiencesRouter;
