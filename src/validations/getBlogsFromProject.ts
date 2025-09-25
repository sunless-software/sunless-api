import { Request, Response, NextFunction } from "express";
import { param, query } from "express-validator";
import { validateResult } from "../utils";

const getBlogsFromProjectValidation = [
  param("projectID").isNumeric().withMessage("project 'id' must be a number"),
  query("offset")
    .optional()
    .isInt({ min: 0 })
    .withMessage("'offset' must be a non-negative integer"),
  query("limit")
    .optional()
    .isInt({ min: 0 })
    .withMessage("'limit' must be a non-negative integer"),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export default getBlogsFromProjectValidation;
