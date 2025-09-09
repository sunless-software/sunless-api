import { Request, Response, NextFunction } from "express";
import { param, query } from "express-validator";
import { validateResult } from "../utils";

const getBlogsFromProjectValidation = [
  param("projectID").isNumeric().withMessage("project 'id' must be a number"),
  query("offset")
    .optional()
    .isNumeric()
    .withMessage("'offset' must be a number"),
  query("limit").optional().isNumeric().withMessage("'limit' must be a number"),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export default getBlogsFromProjectValidation;
