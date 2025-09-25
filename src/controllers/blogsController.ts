import { Request, Response, NextFunction } from "express";
import connectToDB from "../db";
import { AuthRequest } from "../interfaces";
import {
  CREATE_BLOG,
  GET_PROJECT_KEY,
  DELETE_BLOG,
  UPDATE_BLOGS,
  GET_BLOGS_FROM_USER,
  COUNT_BLOGS_FROM_USER,
  GET_BLOGS_FROM_PROJECT,
  COUNT_BLOGS_FROM_PROJECT,
} from "../constants/queries";
import {
  HTTP_STATUS_CODE_CREATED,
  HTTP_STATUS_CODE_NOT_FOUND,
} from "../constants/httpStatusCodes";
import { decryptText, encryptText, sendResponse } from "../utils";
import {
  BLOG_SUCCESSFULLY_CREATED_MESSAGE,
  BLOG_SUCCESSFULLY_DELETED_MESSAGE,
  BLOG_SUCCESSFULY_UPDATED,
  BLOGS_SUCCESSFULLY_RETRIEVED,
  DEFAULT_SUCCES_API_RESPONSE,
} from "../constants/messages";

const blogsController = {
  createBlog: async (req: Request, res: Response, next: NextFunction) => {
    const { projectID } = req.params;
    const { title, content } = req.body;
    const authID = (req as AuthRequest).user.id;
    const db = await connectToDB();

    try {
      const resultGetProjectKey = await db.query(GET_PROJECT_KEY, [projectID]);

      if (!resultGetProjectKey.rowCount) {
        throw new Error(HTTP_STATUS_CODE_NOT_FOUND.toString());
      }

      const encryptedProjectKey = resultGetProjectKey.rows[0].key;
      const decryptedProjectKey = decryptText(encryptedProjectKey);

      const encryptedTitle = encryptText(title, decryptedProjectKey);
      const encryptedContent = encryptText(content, decryptedProjectKey);

      const result = await db.query(CREATE_BLOG, [
        authID,
        projectID,
        encryptedTitle,
        encryptedContent,
      ]);

      const affectedRows = result.rowCount;

      if (!affectedRows) {
        throw new Error(HTTP_STATUS_CODE_NOT_FOUND.toString());
      }

      return sendResponse(
        {
          ...DEFAULT_SUCCES_API_RESPONSE,
          status: HTTP_STATUS_CODE_CREATED,
          message: BLOG_SUCCESSFULLY_CREATED_MESSAGE,
          data: [{ ...result.rows[0], title: title, body: content }],
        },
        res
      );
    } catch (err) {
      return next(err);
    }
  },
  updateBlogs: async (req: Request, res: Response, next: NextFunction) => {
    const { projectID, blogID } = req.params;
    const { title, content } = req.body;
    const db = await connectToDB();

    try {
      const getProjectKeyResult = await db.query(GET_PROJECT_KEY, [projectID]);

      if (!getProjectKeyResult.rows.length) {
        throw new Error(HTTP_STATUS_CODE_NOT_FOUND.toString());
      }

      const encryptedProjectKey = getProjectKeyResult.rows[0].key;
      const decryptedProjectKey = decryptText(encryptedProjectKey);

      const encryptedTitle = title
        ? encryptText(title, decryptedProjectKey)
        : title;
      const encryptedContent = content
        ? encryptText(content, decryptedProjectKey)
        : content;

      const result = await db.query(UPDATE_BLOGS, [
        encryptedTitle,
        encryptedContent,
        blogID,
        projectID,
      ]);

      if (!result.rows.length) {
        throw new Error(HTTP_STATUS_CODE_NOT_FOUND.toString());
      }

      const updatedBlog = result.rows[0];

      return sendResponse(
        {
          ...DEFAULT_SUCCES_API_RESPONSE,
          message: BLOG_SUCCESSFULY_UPDATED,
          data: {
            ...updatedBlog,
            title: decryptText(updatedBlog.title, decryptedProjectKey),
            body: decryptText(updatedBlog.body, decryptedProjectKey),
          },
        },
        res
      );
    } catch (err) {
      return next(err);
    }
  },
  deleteBlogs: async (req: Request, res: Response, next: NextFunction) => {
    const { projectID, blogID } = req.params;
    const db = await connectToDB();

    try {
      const result = await db.query(DELETE_BLOG, [blogID, projectID]);
      const affectedRows = result.rowCount;

      if (!affectedRows) {
        throw new Error(HTTP_STATUS_CODE_NOT_FOUND.toString());
      }

      sendResponse(
        {
          ...DEFAULT_SUCCES_API_RESPONSE,
          message: BLOG_SUCCESSFULLY_DELETED_MESSAGE,
        },
        res
      );
    } catch (err) {
      return next(err);
    }
  },
  getBlogs: async (req: Request, res: Response, next: NextFunction) => {
    const authID = (req as AuthRequest).user.id;
    const { userID, projectID } = req.params;
    const { offset = 0, limit = 20, showPrivateBlogs = false } = req.query;

    const blogsQuery = userID ? GET_BLOGS_FROM_USER : GET_BLOGS_FROM_PROJECT;
    const countQuery = userID
      ? COUNT_BLOGS_FROM_USER
      : COUNT_BLOGS_FROM_PROJECT;
    const queryParams = userID
      ? [userID, showPrivateBlogs, offset, limit]
      : [projectID, offset, limit];

    const db = await connectToDB();

    try {
      const [resultBlogs, resultCount] = await Promise.all([
        db.query(blogsQuery, queryParams),
        db.query(countQuery, [userID ? userID : projectID]),
      ]);

      const blogs = resultBlogs.rows.map((blog) => {
        const { key, collaborators, ["public"]: isPublic, ...cleanBlog } = blog;
        const isCollaborator = collaborators.some(
          (collaboratorID: number) => collaboratorID === authID
        );

        if (isPublic || isCollaborator) {
          const decryptedProjectKey = decryptText(key);

          return {
            ...cleanBlog,
            title: decryptText(blog.title, decryptedProjectKey),
            body: decryptText(blog.body, decryptedProjectKey),
          };
        }

        return cleanBlog;
      });

      return sendResponse(
        {
          ...DEFAULT_SUCCES_API_RESPONSE,
          message: BLOGS_SUCCESSFULLY_RETRIEVED,
          data: blogs,
          pagination: {
            offset:
              typeof offset === "string"
                ? parseInt(offset)
                : (offset as number),
            limit:
              typeof limit === "string" ? parseInt(limit) : (limit as number),
            count: blogs.length,
            total: parseInt(resultCount.rows[0].total),
          },
        },
        res
      );
    } catch (err) {
      return next(err);
    }
  },
};

export default blogsController;
