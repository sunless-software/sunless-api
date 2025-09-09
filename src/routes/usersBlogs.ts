import { Router } from "express";
import blogsController from "../controllers/blogsController";
import roleMiddleware from "../middlewares/roleMiddleware";
import { GLOBAL_PERMISSIONS } from "../constants/globalPermissions";
import getBlogsFromUserValidation from "../validations/getBlogsFromUser";

const usersBlogsRouter = Router({ mergeParams: true });

usersBlogsRouter.get(
  "/",
  roleMiddleware([GLOBAL_PERMISSIONS.readBlogs]),
  getBlogsFromUserValidation,
  blogsController.getBlogs
);

export default usersBlogsRouter;
