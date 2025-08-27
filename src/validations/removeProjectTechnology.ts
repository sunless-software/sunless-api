import { NextFunction, Request, Response } from "express";
import { param, query } from "express-validator";
import { validateResult } from "../utils";

const removeProjectTechnologyValidation = [
  param("id").isNumeric().withMessage("project 'id' must be a number"),
  query("technologyID")
    .exists()
    .withMessage("'technologyID' must be provided")
    .bail()
    .isNumeric()
    .withMessage("'technologyID' must be a number"),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export default removeProjectTechnologyValidation;
