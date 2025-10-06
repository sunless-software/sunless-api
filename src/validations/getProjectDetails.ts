import { NextFunction, Request, Response } from "express";
import { query, param } from "express-validator";
import { validateResult } from "../utils";

const getProjectDetailsValidation = [
  param("projectID").isNumeric().withMessage("project 'id' must be a number"),
  query("lang")
    .optional()
    .isIn(["US", "ES"])
    .withMessage("'lang' must be one of: 'US', 'ES'"),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export default getProjectDetailsValidation;
