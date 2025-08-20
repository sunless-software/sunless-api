import { Request, Response, NextFunction, Router } from "express";
import createExperienceValidation from "../validations/createExperience";
import experiencesController from "../controllers/experiences";
import { AuthRequest } from "../interfaces";
import roleMiddleware from "../middlewares/roleMiddleware";
import { GLOBAL_PERMISSIONS } from "../constants/globalPermissions";
import deleteExperienceValidation from "../validations/deleteExperience";
import connectToDB from "../db";
import { GET_EXPERIENCE_USER_ID } from "../constants/queries";
import updateExperienceValidation from "../validations/updateExperience";
import ownershipMiddleware from "../middlewares/ownershipMiddleware";

const experiencesRouter = Router();

experiencesRouter.post(
  "/",
  ownershipMiddleware(
    "body",
    GLOBAL_PERMISSIONS.createOwnExperiences,
    GLOBAL_PERMISSIONS.createExperiences
  ),
  createExperienceValidation,
  experiencesController.createExperience
);

experiencesRouter.patch(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (isNaN(Number(id))) return next();

    const user = (req as AuthRequest).user;
    const db = await connectToDB();
    const result = await db.query(GET_EXPERIENCE_USER_ID, [id]);
    const experienceUserID: number | undefined = result.rows[0]?.user_id;

    if (experienceUserID && user.id === experienceUserID) {
      return roleMiddleware([GLOBAL_PERMISSIONS.updateOwnExperiences])(
        req,
        res,
        next
      );
    }

    return roleMiddleware([GLOBAL_PERMISSIONS.updateExperiences])(
      req,
      res,
      next
    );
  },
  updateExperienceValidation,
  experiencesController.updateExperience
);

experiencesRouter.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (isNaN(Number(id))) return next();

    const user = (req as AuthRequest).user;
    const db = await connectToDB();
    const result = await db.query(GET_EXPERIENCE_USER_ID, [id]);
    const experienceUserID: number | undefined = result.rows[0]?.user_id;

    if (experienceUserID && user.id === experienceUserID) {
      return roleMiddleware([GLOBAL_PERMISSIONS.deleteOwnExperiences])(
        req,
        res,
        next
      );
    }

    return roleMiddleware([GLOBAL_PERMISSIONS.deleteExperiences])(
      req,
      res,
      next
    );
  },
  deleteExperienceValidation,
  experiencesController.deleteExperience
);

export default experiencesRouter;
