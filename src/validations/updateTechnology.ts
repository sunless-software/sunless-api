import { NextFunction, Request, Response } from "express";
import { param, body } from "express-validator";
import { validateResult } from "../utils";

const updateTechnologyValidation = [
  param("technologyID")
    .isNumeric()
    .withMessage("technology 'id' must be a number"),
  body("technologyName")
    .exists()
    .withMessage("'technologyName' must be provided")
    .bail()
    .isString()
    .withMessage("'technologyName' must be an string")
    .bail()
    .isLength({ min: 1 })
    .withMessage("'technologyName' cannot be empty"),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export default updateTechnologyValidation;
