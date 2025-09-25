import { Request, Response, NextFunction } from "express";
import connectToDB from "../db";
import {
  COUNT_TAGS,
  CREATE_TAG,
  GET_TAGS,
  UPDATE_TAG,
} from "../constants/queries";
import { sendResponse } from "../utils";
import {
  DEFAULT_SUCCES_API_RESPONSE,
  TAG_SUCCESSFULLY_CREATED,
  TAG_SUCCESSFULLY_UPDATED,
  TAGS_SUCCESSFULLY_RETRIEVED_MESSAGE,
} from "../constants/messages";
import {
  HTTP_STATUS_CODE_CREATED,
  HTTP_STATUS_CODE_NOT_FOUND,
} from "../constants/httpStatusCodes";

const tagsController = {
  getTags: async (req: Request, res: Response, next: NextFunction) => {
    const { offset = 0, limit = 20 } = req.query;
    const db = await connectToDB();

    try {
      const [resultTags, resultCount] = await Promise.all([
        db.query(GET_TAGS, [offset, limit]),
        db.query(COUNT_TAGS),
      ]);

      const tags = resultTags.rows;

      return sendResponse(
        {
          ...DEFAULT_SUCCES_API_RESPONSE,
          message: TAGS_SUCCESSFULLY_RETRIEVED_MESSAGE,
          data: tags,
          pagination: {
            offset:
              typeof offset === "string"
                ? parseInt(offset)
                : (offset as number),
            limit:
              typeof limit === "string" ? parseInt(limit) : (limit as number),
            count: tags.length,
            total: parseInt(resultCount.rows[0].total),
          },
        },
        res
      );
    } catch (err) {
      return next(err);
    }
  },
  createTag: async (req: Request, res: Response, next: NextFunction) => {
    const { tagName } = req.body;
    const db = await connectToDB();

    try {
      const result = await db.query(CREATE_TAG, [tagName]);

      return sendResponse(
        {
          ...DEFAULT_SUCCES_API_RESPONSE,
          status: HTTP_STATUS_CODE_CREATED,
          message: TAG_SUCCESSFULLY_CREATED,
          data: result.rows,
        },
        res
      );
    } catch (err) {
      return next(err);
    }
  },
  updateTag: async (req: Request, res: Response, next: NextFunction) => {
    const { tagID } = req.params;
    const { tagName } = req.body;
    const db = await connectToDB();

    try {
      const result = await db.query(UPDATE_TAG, [tagName, tagID]);
      const affectedRows = result.rowCount;

      if (!affectedRows) {
        throw new Error(HTTP_STATUS_CODE_NOT_FOUND.toString());
      }

      return sendResponse(
        {
          ...DEFAULT_SUCCES_API_RESPONSE,
          message: TAG_SUCCESSFULLY_UPDATED,
          data: result.rows,
        },
        res
      );
    } catch (err) {
      return next(err);
    }
  },
};

export default tagsController;
