import { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import { validateResult } from "../utils";

const addUserSkillValidation = [
  body("userID")
    .optional()
    .isNumeric()
    .withMessage("'userID' must be a number"),
  body("skillID")
    .exists()
    .withMessage("'skillID' must be provided")
    .bail()
    .isNumeric()
    .withMessage("'skillID' must be a number"),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export default addUserSkillValidation;
