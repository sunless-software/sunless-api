import { Request, Response, NextFunction, Router } from "express";
import educationController from "../controllers/educationController";
import { AuthRequest } from "../interfaces";
import roleMiddleware from "../middlewares/roleMiddleware";
import { GLOBAL_PERMISSIONS } from "../constants/globalPermissions";
import createEducationValidation from "../validations/createEducation";
import connectToDB from "../db";
import {
  GET_EDUCATION_USER_ID,
  GET_EXPERIENCE_USER_ID,
} from "../constants/queries";
import deleteEducationValidation from "../validations/deleteEducation";
import updateEducationValidation from "../validations/updateEducation";
import ownershipMiddleware from "../middlewares/ownershipMiddleware";

const educationRouter = Router();

educationRouter.post(
  "/",
  ownershipMiddleware(
    "body",
    GLOBAL_PERMISSIONS.createOwnEducations,
    GLOBAL_PERMISSIONS.createEducations
  ),
  createEducationValidation,
  educationController.createEducation
);

educationRouter.patch(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (isNaN(Number(id))) return next();

    const user = (req as AuthRequest).user;
    const db = await connectToDB();
    const result = await db.query(GET_EDUCATION_USER_ID, [id]);
    const educationUserID: number | undefined = result.rows[0]?.user_id;

    if (educationUserID && user.id === educationUserID) {
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
  updateEducationValidation,
  educationController.updateEducation
);

educationRouter.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (isNaN(Number(id))) return next();

    const user = (req as AuthRequest).user;
    const db = await connectToDB();
    const result = await db.query(GET_EDUCATION_USER_ID, [id]);
    const educationUserID: number | undefined = result.rows[0]?.user_id;

    if (educationUserID && user.id === educationUserID) {
      return roleMiddleware([GLOBAL_PERMISSIONS.deleteOwnEducation])(
        req,
        res,
        next
      );
    }

    return roleMiddleware([GLOBAL_PERMISSIONS.deleteEducations])(
      req,
      res,
      next
    );
  },
  deleteEducationValidation,
  educationController.deleteEducation
);

export default educationRouter;
