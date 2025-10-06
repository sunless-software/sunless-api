import { Router } from "express";
import projectRoleMiddleware from "../middlewares/projectRoleMiddleware";
import { GLOBAL_PERMISSIONS } from "../constants/globalPermissions";
import { PROJECT_PERMISSIONS } from "../constants/projectPermissions";
import createBlogValidation from "../validations/createBlog";
import blogsController from "../controllers/blogsController";
import updateBlogValidation from "../validations/updateBlog";
import deleteBlogValidation from "../validations/deleteBlog";
import getBlogsFromProjectValidation from "../validations/getBlogsFromProject";
import roleMiddleware from "../middlewares/roleMiddleware";

const blogsRouter = Router({ mergeParams: true });

blogsRouter.get(
  // TODO: Revisar
  "/",
  roleMiddleware([GLOBAL_PERMISSIONS.readBlogs]),
  getBlogsFromProjectValidation,
  blogsController.getBlogs
);

blogsRouter.post(
  "/",
  projectRoleMiddleware(
    GLOBAL_PERMISSIONS.createBlogs,
    PROJECT_PERMISSIONS.createBlogs
  ),
  createBlogValidation,
  blogsController.createBlog
);

blogsRouter.patch(
  "/:blogID",
  projectRoleMiddleware(
    GLOBAL_PERMISSIONS.updateBlogs,
    PROJECT_PERMISSIONS.updateBlogs
  ),
  updateBlogValidation,
  blogsController.updateBlogs
);

blogsRouter.delete(
  // TODO: Revisar
  "/:blogID",
  projectRoleMiddleware(
    GLOBAL_PERMISSIONS.deleteBlogs,
    PROJECT_PERMISSIONS.deleteBlogs
  ),
  deleteBlogValidation,
  blogsController.deleteBlogs
);

export default blogsRouter;
