import { NextFunction, Request, Response } from "express";
import { param, query } from "express-validator";
import { validateResult } from "../utils";

const removeProjectTechnologyValidation = [
  param("projectID").isNumeric().withMessage("project 'id' must be a number"),
  param("technologyID")
    .isNumeric()
    .withMessage("technology 'id' must be a number"),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export default removeProjectTechnologyValidation;
