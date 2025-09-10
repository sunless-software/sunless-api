import { Router } from "express";
import ownershipMiddleware from "../middlewares/ownershipMiddleware";
import { GLOBAL_PERMISSIONS } from "../constants/globalPermissions";
import addUserTechnologyValidation from "../validations/addUserTechnology";
import technologiesController from "../controllers/technologiesController";
import removeUserTechnologyValidation from "../validations/removeUserTechnology";
import getTechnologiesValidation from "../validations/getTechnologies";

const userTechnologiesRouter = Router({ mergeParams: true });

/* userTechnologiesRouter.get(
  "/",
  getTechnologiesValidation,
  technologiesController.getTechnologies
);
 */
userTechnologiesRouter.post(
  "/",
  ownershipMiddleware(
    GLOBAL_PERMISSIONS.addOwnTechnologies,
    GLOBAL_PERMISSIONS.addTechnologies
  ),
  addUserTechnologyValidation,
  technologiesController.addUserTechnology
);

userTechnologiesRouter.delete(
  "/:technologyID",
  ownershipMiddleware(
    GLOBAL_PERMISSIONS.removeOwnTechnologies,
    GLOBAL_PERMISSIONS.removeTechnologies
  ),
  removeUserTechnologyValidation,
  technologiesController.removeUserTechnology
);

export default userTechnologiesRouter;
