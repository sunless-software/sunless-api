import { NextFunction, Request, Response } from "express";
import { body, param } from "express-validator";
import { validateResult } from "../utils";

const updateTagValidations = [
  param("tagID").isNumeric().withMessage("tag 'id' must be a number"),
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

export default updateTagValidations;
