import { Router } from "express";
import ownershipMiddleware from "../middlewares/ownershipMiddleware";
import { GLOBAL_PERMISSIONS } from "../constants/globalPermissions";
import addUserTechnologyValidation from "../validations/addUserTechnology";
import technologiesController from "../controllers/technologiesController";
import removeUserTechnologyValidation from "../validations/removeUserTechnology";
import getTechnologiesValidation from "../validations/getTechnologies";

const technologiesRouter = Router();

technologiesRouter.get(
  "/",
  getTechnologiesValidation,
  technologiesController.getTechnologies
);

technologiesRouter.post(
  "/add",
  ownershipMiddleware(
    "body",
    GLOBAL_PERMISSIONS.addOwnTechnologies,
    GLOBAL_PERMISSIONS.addTechnologies
  ),
  addUserTechnologyValidation,
  technologiesController.addUserTechnology
);

technologiesRouter.delete(
  "/remove/:id",
  ownershipMiddleware(
    "query",
    GLOBAL_PERMISSIONS.removeOwnTechnologies,
    GLOBAL_PERMISSIONS.removeTechnologies
  ),
  removeUserTechnologyValidation,
  technologiesController.removeUserTechnology
);

export default technologiesRouter;
