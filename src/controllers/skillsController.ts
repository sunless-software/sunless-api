import { NextFunction, Request, Response } from "express";
import connectToDB from "../db";
import {
  ADD_USER_SKILL,
  COUNT_SKILLS,
  GET_SKILLS,
  REMOVE_USER_SKILL,
} from "../constants/queries";
import {
  HTTP_STATUS_CODE_CREATED,
  HTTP_STATUS_CODE_NOT_FOUND,
} from "../constants/httpStatusCodes";
import { AuthRequest, CustomError } from "../interfaces";
import { sendResponse } from "../utils";
import {
  DEFAULT_SUCCES_API_RESPONSE,
  SKILLS_SUCCESSFULLY_RETRIEVED_MESSAGE,
  USER_SKILL_SUCCESSFULLY_ADDED,
  USER_SKILL_SUCCESSFULLY_REMOVED,
} from "../constants/messages";
import { GET_SKILLS_DEFAULT_LIMIT } from "../constants/setup";

const skillsController = {
  getSkills: async (req: Request, res: Response, next: NextFunction) => {
    const { offset = 0, limit = GET_SKILLS_DEFAULT_LIMIT } = req.query;
    const db = await connectToDB();

    try {
      const [countSkillsResult, getSkillsResult] = await Promise.all([
        db.query(COUNT_SKILLS),
        db.query(GET_SKILLS, [offset, limit]),
      ]);
      const skills = getSkillsResult.rows;

      return sendResponse(
        {
          ...DEFAULT_SUCCES_API_RESPONSE,
          message: SKILLS_SUCCESSFULLY_RETRIEVED_MESSAGE,
          data: skills,
          pagination: {
            offset:
              typeof offset === "string"
                ? parseInt(offset)
                : (offset as number),
            limit:
              typeof limit === "string" ? parseInt(limit) : (limit as number),
            count: skills.length,
            total: parseInt(countSkillsResult.rows[0].total),
          },
        },
        res
      );
    } catch (err) {
      return next(err);
    }
  },
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
