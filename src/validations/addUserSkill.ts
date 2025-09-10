import { NextFunction, Request, Response } from "express";
import { body, param } from "express-validator";
import { validateResult } from "../utils";

const addUserSkillValidation = [
  param("userID").isNumeric().withMessage("user 'id' must be a number"),
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
