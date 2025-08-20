import { NextFunction, Request, Response } from "express";
import connectToDB from "../db";
import { ADD_USER_SKILL, REMOVE_USER_SKILL } from "../constants/queries";
import {
  HTTP_STATUS_CODE_CREATED,
  HTTP_STATUS_CODE_NOT_FOUND,
} from "../constants/httpStatusCodes";
import { AuthRequest, CustomError } from "../interfaces";
import { sendResponse } from "../utils";
import {
  DEFAULT_SUCCES_API_RESPONSE,
  USER_SKILL_SUCCESSFULLY_ADDED,
  USER_SKILL_SUCCESSFULLY_REMOVED,
} from "../constants/messages";

const skillsController = {
  addSkill: async (req: Request, res: Response, next: NextFunction) => {
    const authID = (req as AuthRequest).user.id;
    const { skillID } = req.body;
    const userID = req.body.userID || authID;
    const db = await connectToDB();

    try {
      const result = await db.query(ADD_USER_SKILL, [userID, skillID]);
      const affectedRows = result.rowCount;

      if (!affectedRows) {
        throw new Error(HTTP_STATUS_CODE_NOT_FOUND.toString());
      }

      return sendResponse(
        {
          ...DEFAULT_SUCCES_API_RESPONSE,
          status: HTTP_STATUS_CODE_CREATED,
          message: USER_SKILL_SUCCESSFULLY_ADDED,
          data: result.rows,
        },
        res
      );
    } catch (err) {
      return next(err);
    }
  },
  removeSkill: async (req: Request, res: Response, next: NextFunction) => {
    const authID = (req as AuthRequest).user.id;
    const skillID = req.params.id;
    const userID = req.query.id || authID;
    const db = await connectToDB();

    try {
      const result = await db.query(REMOVE_USER_SKILL, [userID, skillID]);
      const affectedRows = result.rowCount;

      if (!affectedRows) {
        throw new Error(HTTP_STATUS_CODE_NOT_FOUND.toString());
      }

      return sendResponse(
        {
          ...DEFAULT_SUCCES_API_RESPONSE,
          message: USER_SKILL_SUCCESSFULLY_REMOVED,
        },
        res
      );
    } catch (err) {
      return next(err);
    }
  },
};

export default skillsController;
