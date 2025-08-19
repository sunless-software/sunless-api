import { Request, Response, NextFunction, Router } from "express";
import createExperienceValidation from "../validations/createExperience";
import experiencesController from "../controllers/experiences";
import { AuthRequest } from "../interfaces";
import roleMiddleware from "../middlewares/roleMiddleware";
import { GLOBAL_PERMISSIONS } from "../constants/globalPermissions";
import deleteExperienceValidation from "../validations/deleteExperience";
import connectToDB from "../db";
import { GET_EXPERIENCE_USER_ID } from "../constants/queries";

const experiencesRouter = Router();

experiencesRouter.post(
  "/create",
  async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as AuthRequest).user;
    const { userID } = req.body;

    if (!userID || userID === user.id) {
      req.body.userID = user.id;

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

experiencesRouter.delete(
  "/:id",
  deleteExperienceValidation,
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const db = await connectToDB();
    const result = await db.query(GET_EXPERIENCE_USER_ID, [id]);
    const experienceUserID: number | undefined = result.rows[0]?.user_id;

    if (experienceUserID && id === experienceUserID.toString()) {
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
  experiencesController.deleteExperience
);

export default experiencesRouter;
