import { NextFunction, Request, Response } from "express";
import connectToDB from "../db";
import {
  CREATE_PROJECT_MEDIA,
  DELETE_PROJECT_MEDIA,
} from "../constants/queries";
import {
  HTTP_STATUS_CODE_CREATED,
  HTTP_STATUS_CODE_NOT_FOUND,
} from "../constants/httpStatusCodes";
import { sendResponse } from "../utils";
import {
  DEFAULT_SUCCES_API_RESPONSE,
  PROJECT_MEDIA_SUCCESSFULLY_CREATED,
  PROJECT_MEDIA_SUCCESSFULLY_DELETED,
} from "../constants/messages";

const projectsMediaController = {
  createProjectMedia: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { projectID } = req.params;
    const { url, type } = req.body;
    const db = await connectToDB();

    try {
      const result = await db.query(CREATE_PROJECT_MEDIA, [
        projectID,
        url,
        type,
      ]);
      const affectedRows = result.rowCount;

      if (!affectedRows) {
        throw new Error(HTTP_STATUS_CODE_NOT_FOUND.toString());
      }

      return sendResponse(
        {
          ...DEFAULT_SUCCES_API_RESPONSE,
          status: HTTP_STATUS_CODE_CREATED,
          message: PROJECT_MEDIA_SUCCESSFULLY_CREATED,
          data: result.rows,
        },
        res
      );
    } catch (err) {
      return next(err);
    }
  },
  deleteProjectMedia: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { projectID, mediaID } = req.params;
    const db = await connectToDB();

    try {
      const result = await db.query(DELETE_PROJECT_MEDIA, [projectID, mediaID]);
      const affectedRows = result.rowCount;

      if (!affectedRows) {
        throw new Error(HTTP_STATUS_CODE_NOT_FOUND.toString());
      }

      return sendResponse(
        {
          ...DEFAULT_SUCCES_API_RESPONSE,
          message: PROJECT_MEDIA_SUCCESSFULLY_DELETED,
        },
        res
      );
    } catch (err) {
      return next(err);
    }
  },
};

export default projectsMediaController;
