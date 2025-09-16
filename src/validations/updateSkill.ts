import { NextFunction, Request, Response } from "express";
import { param, body } from "express-validator";
import { validateResult } from "../utils";

const updateSkillValidations = [
  param("skillID").isNumeric().withMessage("skill 'id' must be a number"),
  body("skillName")
    .exists()
    .withMessage("'skillName' must be provided")
    .bail()
    .isString()
    .withMessage("'skillName' must be an string")
    .bail()
    .isLength({ min: 1 })
    .withMessage("'skillName' cannot be empty"),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export default updateSkillValidations;
