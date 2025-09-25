import { Router } from "express";
import createExperienceValidation from "../validations/createExperience";
import experiencesController from "../controllers/experiences";
import { GLOBAL_PERMISSIONS } from "../constants/globalPermissions";
import deleteExperienceValidation from "../validations/deleteExperience";
import updateExperienceValidation from "../validations/updateExperience";
import ownershipMiddleware from "../middlewares/ownershipMiddleware";

const experiencesRouter = Router({ mergeParams: true });

experiencesRouter.post(
  "/",
  ownershipMiddleware(
    GLOBAL_PERMISSIONS.createOwnExperiences,
    GLOBAL_PERMISSIONS.createExperiences
  ),
  createExperienceValidation,
  experiencesController.createExperience
);

experiencesRouter.patch(
  "/:experienceID",
  ownershipMiddleware(
    GLOBAL_PERMISSIONS.updateOwnExperiences,
    GLOBAL_PERMISSIONS.updateExperiences
  ),
  updateExperienceValidation,
  experiencesController.updateExperience
);

experiencesRouter.delete(
  "/:experienceID",
  ownershipMiddleware(
    GLOBAL_PERMISSIONS.deleteOwnExperiences,
    GLOBAL_PERMISSIONS.deleteExperiences
  ),
  deleteExperienceValidation,
  experiencesController.deleteExperience
);

export default experiencesRouter;
