import { Router } from "express";
import ownershipMiddleware from "../middlewares/ownershipMiddleware";
import { GLOBAL_PERMISSIONS } from "../constants/globalPermissions";
import addUserTechnologyValidation from "../validations/addUserTechnology";
import userTechnologiesController from "../controllers/userTechnologiesController";
import removeUserTechnologyValidation from "../validations/removeUserTechnology";

const userTechnologiesRouter = Router({ mergeParams: true });

userTechnologiesRouter.post(
  "/",
  ownershipMiddleware(
    GLOBAL_PERMISSIONS.addOwnTechnologies,
    GLOBAL_PERMISSIONS.addTechnologies
  ),
  addUserTechnologyValidation,
  userTechnologiesController.addUserTechnology
);

userTechnologiesRouter.delete(
  "/:technologyID",
  ownershipMiddleware(
    GLOBAL_PERMISSIONS.removeOwnTechnologies,
    GLOBAL_PERMISSIONS.removeTechnologies
  ),
  removeUserTechnologyValidation,
  userTechnologiesController.removeUserTechnology
);

export default userTechnologiesRouter;
