import { Router } from "express";
import ownershipMiddleware from "../middlewares/ownershipMiddleware";
import { GLOBAL_PERMISSIONS } from "../constants/globalPermissions";
import addUserTechnologyValidation from "../validations/addUserTechnology";
import technologiesController from "../controllers/technologiesController";

const technologiesRouter = Router();

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

export default technologiesRouter;
