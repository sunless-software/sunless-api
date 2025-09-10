import { NextFunction, Request, Response } from "express";
import connectToDB from "../db";
import { COUNT_SKILLS, GET_SKILLS } from "../constants/queries";
import { sendResponse } from "../utils";
import {
  DEFAULT_SUCCES_API_RESPONSE,
  SKILLS_SUCCESSFULLY_RETRIEVED_MESSAGE,
} from "../constants/messages";

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
};

export default skillsController;
