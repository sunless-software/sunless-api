import { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import { validateResult } from "../utils";

const createSkillValidations = [
  body("skillNameUS")
    .exists()
    .withMessage("'skillNameUS' must be provided")
    .bail()
    .isString()
    .withMessage("'skillNameUS' must be an string")
    .bail()
    .isLength({ min: 1 })
    .withMessage("'skillNameUS' cannot be empty"),
  body("skillNameES")
    .optional()
    .isString()
    .withMessage("'skillNameES' must be an string")
    .bail()
    .isLength({ min: 1 })
    .withMessage("'skillNameES' cannot be empty"),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export default createSkillValidations;
