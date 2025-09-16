import { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import { validateResult } from "../utils";

const createTagValidations = [
  body("tagName")
    .exists()
    .withMessage("'tagName' must be provided")
    .bail()
    .isString()
    .withMessage("'tagName' must be an string")
    .bail()
    .isLength({ min: 1 })
    .withMessage("'tagName' cannot be empty"),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export default createTagValidations;
