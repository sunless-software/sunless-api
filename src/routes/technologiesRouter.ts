import { Router } from "express";
import getTechnologiesValidation from "../validations/getTechnologies";
import technologiesController from "../controllers/technologiesController";

const technologiesRouter = Router({ mergeParams: true });

technologiesRouter.get(
  "/",
  getTechnologiesValidation,
  technologiesController.getTechnologies
);

export default technologiesRouter;
