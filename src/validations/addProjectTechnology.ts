import { NextFunction, Request, Response } from "express";
import { body, param } from "express-validator";
import { validateResult } from "../utils";

const addProjectTechnologyValidation = [
  param("projectID")
    .exists()
    .withMessage("'projectID' must be provided")
    .bail()
    .isNumeric()
    .withMessage("'projectID' must be a number"),
  body("technologyID")
    .exists()
    .withMessage("'technologyID' must be provided")
    .bail()
    .isNumeric()
    .withMessage("'technologyID' must be a number"),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export default addProjectTechnologyValidation;
