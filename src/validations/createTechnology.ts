import { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import { validateResult } from "../utils";

const createTechnologyValidation = [
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

export default createTechnologyValidation;
