import { NextFunction, Request, Response } from "express";
import connectToDB from "../db";
import { ADD_PROJECT_TAG, REMOVE_PROJECT_TAG } from "../constants/queries";
import {
  HTTP_STATUS_CODE_CREATED,
  HTTP_STATUS_CODE_NOT_FOUND,
} from "../constants/httpStatusCodes";
import { sendResponse } from "../utils";
import {
  DEFAULT_SUCCES_API_RESPONSE,
  TAG_SUCCESSFULLY_ADDED,
  TAG_SUCCESSFULLY_REMOVED,
} from "../constants/messages";

const projectTagsController = {
  addProjectTag: async (req: Request, res: Response, next: NextFunction) => {
    const { projectID } = req.params;
    const { tagID } = req.body;

    const db = await connectToDB();

    try {
      const result = await db.query(ADD_PROJECT_TAG, [projectID, tagID]);
      const affectedRows = result.rowCount;

      if (!affectedRows) {
        throw new Error(HTTP_STATUS_CODE_NOT_FOUND.toString());
      }

      return sendResponse(
        {
          ...DEFAULT_SUCCES_API_RESPONSE,
          status: HTTP_STATUS_CODE_CREATED,
          message: TAG_SUCCESSFULLY_ADDED,
          data: result.rows,
        },
        res
      );
    } catch (err) {
      return next(err);
    }
  },
  removeProjectTag: async (req: Request, res: Response, next: NextFunction) => {
    const { projectID, tagID } = req.params;

    const db = await connectToDB();

    try {
      const result = await db.query(REMOVE_PROJECT_TAG, [projectID, tagID]);
      const affectedRows = result.rowCount;

      if (!affectedRows) {
        throw new Error(HTTP_STATUS_CODE_NOT_FOUND.toString());
      }

      return sendResponse(
        { ...DEFAULT_SUCCES_API_RESPONSE, message: TAG_SUCCESSFULLY_REMOVED },
        res
      );
    } catch (err) {
      return next(err);
    }
  },
};

export default projectTagsController;
