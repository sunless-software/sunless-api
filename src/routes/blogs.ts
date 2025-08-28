import { Request, Response, NextFunction, Router } from "express";
import blogsController from "../controllers/blogs";
import createBlogValidation from "../validations/createBlog";
import projectRoleMiddleware from "../middlewares/projectRoleMiddleware";
import { GLOBAL_PERMISSIONS } from "../constants/globalPermissions";
import { PROJECT_PERMISSIONS } from "../constants/projectPermissions";

const blogsRouter = Router();

blogsRouter.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    const { projectID } = req.body;
    projectRoleMiddleware(
      GLOBAL_PERMISSIONS.createBlogs,
      PROJECT_PERMISSIONS.createBlogs,
      projectID
    )(req, res, next);
  },
  createBlogValidation,
  blogsController.createBlog
);

export default blogsRouter;
