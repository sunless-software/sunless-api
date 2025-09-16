import { Router } from "express";
import tagsController from "../controllers/tagsController";
import createTagValidations from "../validations/createTag";
import roleMiddleware from "../middlewares/roleMiddleware";
import { GLOBAL_PERMISSIONS } from "../constants/globalPermissions";
import getTagsValidations from "../validations/getTags";

const tagsRouter = Router();

tagsRouter.get("/", getTagsValidations, tagsController.getTags);

tagsRouter.post(
  "/",
  roleMiddleware([GLOBAL_PERMISSIONS.createTags]),
  createTagValidations,
  tagsController.createTag
);

export default tagsRouter;
