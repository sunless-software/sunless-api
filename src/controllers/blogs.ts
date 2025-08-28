import { Request, Response, NextFunction } from "express";
import connectToDB from "../db";
import { AuthRequest } from "../interfaces";
import { CREATE_BLOG, GET_PROJECT_KEY } from "../constants/queries";
import {
  HTTP_STATUS_CODE_CREATED,
  HTTP_STATUS_CODE_NOT_FOUND,
} from "../constants/httpStatusCodes";
import { decryptText, encryptText, sendResponse } from "../utils";
import {
  BLOG_SUCCESSFULLY_CREATED_MESSAGE,
  DEFAULT_SUCCES_API_RESPONSE,
} from "../constants/messages";

const blogsController = {
  createBlog: async (req: Request, res: Response, next: NextFunction) => {
    const { projectID, title, content } = req.body;
    const authID = (req as AuthRequest).user.id;
    const db = await connectToDB();

    try {
      await db.query("BEGIN");

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

      await db.query("COMMIT");

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
      await db.query("ROLLBACK");
      return next(err);
    }
  },
};

export default blogsController;
