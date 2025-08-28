import { Request, Response, NextFunction, Router } from "express";
import blogsController from "../controllers/blogs";
import createBlogValidation from "../validations/createBlog";
import projectRoleMiddleware from "../middlewares/projectRoleMiddleware";
import { GLOBAL_PERMISSIONS } from "../constants/globalPermissions";
import { PROJECT_PERMISSIONS } from "../constants/projectPermissions";
import deleteBlogValidation from "../validations/deleteBlog";
import connectToDB from "../db";
import { GET_PROJECT_ID_FROM_BLOG } from "../constants/queries";

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

blogsRouter.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const db = await connectToDB();
    const result = await db.query(GET_PROJECT_ID_FROM_BLOG, [req.params.id]);
    const projectID = result.rows.length ? result.rows[0].project_id : 0;
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
