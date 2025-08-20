import { NextFunction, Request, Response } from "express";
import { param, query } from "express-validator";
import { validateResult } from "../utils";

const removeUserSkillValidation = [
  param("id").isNumeric().withMessage("skill 'id' must be a number"),
  query("id").optional().isNumeric().withMessage("user 'id' must be a number"),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export default removeUserSkillValidation;
