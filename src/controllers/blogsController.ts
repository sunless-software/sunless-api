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
    const { titleUS, titleES, contentUS, contentES } = req.body;
    const authID = (req as AuthRequest).user.id;
    const db = await connectToDB();

    try {
      const resultGetProjectKey = await db.query(GET_PROJECT_KEY, [projectID]);

      if (!resultGetProjectKey.rowCount) {
        throw new Error(HTTP_STATUS_CODE_NOT_FOUND.toString());
      }

      const encryptedProjectKey = resultGetProjectKey.rows[0].key;
      const decryptedProjectKey = decryptText(encryptedProjectKey);

      const encryptedTitleUS = encryptText(titleUS, decryptedProjectKey);
      const encryptedContentUS = encryptText(contentUS, decryptedProjectKey);
      const encryptedTitleES = titleES
        ? encryptText(titleES, decryptedProjectKey)
        : "";
      const encryptedContentES = contentES
        ? encryptText(contentES, decryptedProjectKey)
        : "";

      const result = await db.query(CREATE_BLOG, [
        authID,
        projectID,
        encryptedTitleUS,
        encryptedTitleES,
        encryptedContentUS,
        encryptedContentES,
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
          data: [
            {
              ...result.rows[0],
              title_us: titleUS,
              title_es: titleES || "",
              body_us: contentUS,
              body_es: contentES || "",
            },
          ],
        },
        res
      );
    } catch (err) {
      return next(err);
    }
  },
  updateBlogs: async (req: Request, res: Response, next: NextFunction) => {
    const { projectID, blogID } = req.params;
    const { titleUS, titleES, contentUS, contentES } = req.body;
    const db = await connectToDB();

    try {
      const getProjectKeyResult = await db.query(GET_PROJECT_KEY, [projectID]);

      if (!getProjectKeyResult.rows.length) {
        throw new Error(HTTP_STATUS_CODE_NOT_FOUND.toString());
      }

      const encryptedProjectKey = getProjectKeyResult.rows[0].key;
      const decryptedProjectKey = decryptText(encryptedProjectKey);

      const encryptedTitleUS = titleUS
        ? encryptText(titleUS, decryptedProjectKey)
        : titleUS;
      const encryptedContentUS = contentUS
        ? encryptText(contentUS, decryptedProjectKey)
        : contentUS;

      const encryptedTitleES = titleES
        ? encryptText(titleES, decryptedProjectKey)
        : titleES;
      const encryptedContentES = contentES
        ? encryptText(contentES, decryptedProjectKey)
        : contentES;

      const result = await db.query(UPDATE_BLOGS, [
        encryptedTitleUS,
        encryptedTitleES,
        encryptedContentUS,
        encryptedContentES,
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
            title_us: decryptText(updatedBlog.title_us, decryptedProjectKey),
            body_us: decryptText(updatedBlog.body_us, decryptedProjectKey),
            title_es: updatedBlog.title_es
              ? decryptText(updatedBlog.title_es, decryptedProjectKey)
              : "",
            body_es: updatedBlog.body_es
              ? decryptText(updatedBlog.body_es, decryptedProjectKey)
              : "",
          },
        },
        res
      );
    } catch (err) {
      console.log("balabinga");
      console.log(err);

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
