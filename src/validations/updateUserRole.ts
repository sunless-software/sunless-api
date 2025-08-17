import { NextFunction, Request, Response } from "express";
import { param, body } from "express-validator";
import { validateResult } from "../utils";

const updateUserRoleValidation = [
  param("id").isNumeric().withMessage("user 'id' must be a number"),
  body("roleID")
    .exists()
    .withMessage("'roleID' must be provided")
    .isNumeric()
    .withMessage("'roleID' must be a number"),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export default updateUserRoleValidation;
