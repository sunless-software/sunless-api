import { Request, Response, NextFunction } from "express";
import connectToDB from "../db";
import { CREATE_TAG } from "../constants/queries";
import { sendResponse } from "../utils";
import {
  DEFAULT_SUCCES_API_RESPONSE,
  TAG_SUCCESSFULLY_CREATED,
} from "../constants/messages";
import { HTTP_STATUS_CODE_CREATED } from "../constants/httpStatusCodes";

const tagsController = {
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
};

export default tagsController;
