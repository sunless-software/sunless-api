import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../interfaces";
import connectToDB from "../db";
import { ADD_USER_TECHNOLOGY } from "../constants/queries";
import {
  HTTP_STATUS_CODE_CREATED,
  HTTP_STATUS_CODE_NOT_FOUND,
} from "../constants/httpStatusCodes";
import { sendResponse } from "../utils";
import {
  DEFAULT_SUCCES_API_RESPONSE,
  USER_TECHNOLOGY_SUCCESSFULLY_ADDED,
} from "../constants/messages";

const technologiesController = {
  addUserTechnology: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const authID = (req as AuthRequest).user.id;
    const { technologyID } = req.body;
    const userID = req.body.userID || authID;
    const db = await connectToDB();

    try {
      const result = await db.query(ADD_USER_TECHNOLOGY, [
        userID,
        technologyID,
      ]);
      const affectedRows = result.rowCount;

      if (!affectedRows) {
        throw new Error(HTTP_STATUS_CODE_NOT_FOUND.toString());
      }

      return sendResponse(
        {
          ...DEFAULT_SUCCES_API_RESPONSE,
          status: HTTP_STATUS_CODE_CREATED,
          message: USER_TECHNOLOGY_SUCCESSFULLY_ADDED,
          data: result.rows,
        },
        res
      );
    } catch (err) {
      return next(err);
    }
  },
};

export default technologiesController;
