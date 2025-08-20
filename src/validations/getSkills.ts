import { NextFunction, Request, Response } from "express";
import { query } from "express-validator";
import { validateResult } from "../utils";

const getSkillsValidation = [
  query("offset")
    .optional()
    .isNumeric()
    .withMessage("'offset' must be a number"),
  query("limit").optional().isNumeric().withMessage("'limit' must be a number"),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export default getSkillsValidation;
