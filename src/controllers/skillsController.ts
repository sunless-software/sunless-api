import { NextFunction, Request, Response } from "express";
import connectToDB from "../db";
import { COUNT_SKILLS, CREATE_SKILL, GET_SKILLS } from "../constants/queries";
import { sendResponse } from "../utils";
import {
  DEFAULT_SUCCES_API_RESPONSE,
  SKILL_SUCCESSFULLY_CREATED,
  SKILLS_SUCCESSFULLY_RETRIEVED_MESSAGE,
} from "../constants/messages";
import { HTTP_STATUS_CODE_CREATED } from "../constants/httpStatusCodes";

const skillsController = {
  getSkills: async (req: Request, res: Response, next: NextFunction) => {
    const { offset = 0, limit = 20 } = req.query;
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
  createSkill: async (req: Request, res: Response, next: NextFunction) => {
    const { skillName } = req.body;
    const db = await connectToDB();

    try {
      const result = await db.query(CREATE_SKILL, [skillName]);

      sendResponse(
        {
          ...DEFAULT_SUCCES_API_RESPONSE,
          status: HTTP_STATUS_CODE_CREATED,
          message: SKILL_SUCCESSFULLY_CREATED,
          data: result.rows,
        },
        res
      );
    } catch (err) {
      return next(err);
    }
  },
};

export default skillsController;
