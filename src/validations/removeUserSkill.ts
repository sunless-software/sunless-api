import { NextFunction, Request, Response } from "express";
import { param, query } from "express-validator";
import { validateResult } from "../utils";

const removeUserSkillValidation = [
  param("userID").isNumeric().withMessage("user 'id' must be a number"),
  param("skillID").isNumeric().withMessage("skill 'id' must be a number"),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export default removeUserSkillValidation;
