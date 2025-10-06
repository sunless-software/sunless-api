import { Router } from "express";
import educationController from "../controllers/educationController";
import { GLOBAL_PERMISSIONS } from "../constants/globalPermissions";
import createEducationValidation from "../validations/createEducation";
import deleteEducationValidation from "../validations/deleteEducation";
import updateEducationValidation from "../validations/updateEducation";
import ownershipMiddleware from "../middlewares/ownershipMiddleware";

const educationRouter = Router({ mergeParams: true });

educationRouter.post(
  "/",
  ownershipMiddleware(
    GLOBAL_PERMISSIONS.createOwnEducations,
    GLOBAL_PERMISSIONS.createEducations
  ),
  createEducationValidation,
  educationController.createEducation
);

educationRouter.patch(
  // TODO: Revisar
  "/:educationID",
  ownershipMiddleware(
    GLOBAL_PERMISSIONS.updateOwnEducations,
    GLOBAL_PERMISSIONS.updateEducations
  ),
  updateEducationValidation,
  educationController.updateEducation
);

educationRouter.delete(
  // TODO: Revisar
  "/:educationID",
  ownershipMiddleware(
    GLOBAL_PERMISSIONS.deleteOwnEducation,
    GLOBAL_PERMISSIONS.deleteEducations
  ),
  deleteEducationValidation,
  educationController.deleteEducation
);

export default educationRouter;
