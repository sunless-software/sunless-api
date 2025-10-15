import { NextFunction, Request, Response } from "express";
import { param, body } from "express-validator";
import { validateResult } from "../utils";

const updateSkillValidations = [
  param("skillID").isNumeric().withMessage("skill 'id' must be a number"),
  body("skillNameUS")
    .optional()
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

export default updateSkillValidations;
