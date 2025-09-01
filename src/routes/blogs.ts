import { NextFunction, Request, Response, Router } from "express";
import projectRoleMiddleware from "../middlewares/projectRoleMiddleware";
import { GLOBAL_PERMISSIONS } from "../constants/globalPermissions";
import { PROJECT_PERMISSIONS } from "../constants/projectPermissions";
import createBlogValidation from "../validations/createBlog";
import blogsController from "../controllers/blogs";
import updateBlogValidation from "../validations/updateBlog";
import deleteBlogValidation from "../validations/deleteBlog";

const blogsRouter = Router();

blogsRouter.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    const projectID = parseInt(req.params.projectID) || 0;
    projectRoleMiddleware(
      GLOBAL_PERMISSIONS.createBlogs,
      PROJECT_PERMISSIONS.createBlogs,
      projectID
    )(req, res, next);
  },
  createBlogValidation,
  blogsController.createBlog
);

blogsRouter.patch(
  "/:blogID",
  async (req: Request, res: Response, next: NextFunction) => {
    const projectID = parseInt(req.params.projectID) || 0;
    req.body.projectID = projectID;
    projectRoleMiddleware(
      GLOBAL_PERMISSIONS.updateBlogs,
      PROJECT_PERMISSIONS.updateBlogs,
      projectID
    )(req, res, next);
  },
  updateBlogValidation,
  blogsController.updateBlogs
);

blogsRouter.delete(
  "/:blogID",
  async (req: Request, res: Response, next: NextFunction) => {
    const projectID = parseInt(req.params.projectID) || 0;
    projectRoleMiddleware(
      GLOBAL_PERMISSIONS.deleteBlogs,
      PROJECT_PERMISSIONS.deleteBlogs,
      projectID
    )(req, res, next);
  },
  deleteBlogValidation,
  blogsController.deleteBlogs
);

export default blogsRouter;
