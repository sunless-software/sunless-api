import { NextFunction, Request, Response } from "express";
import { param, body } from "express-validator";
import { validateResult } from "../utils";

const updateGlobalRoleValidation = [
  param("roleID")
    .isNumeric()
    .withMessage("role 'id' must be a number")
    .bail()
    .custom((value) => {
      if (parseInt(value) === 1) {
        throw new Error("global role with id 1 cannot be modified");
      }
      return true;
    }),
  body("roleName")
    .optional()
    .isString()
    .withMessage("'roleName' must be an string")
    .bail()
    .isLength({ min: 1 })
    .withMessage("'roleName' cannot be empty"),
  body("permissions")
    .optional()
    .isArray({ min: 1 })
    .withMessage("'permissions' must be a non empty array"),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export default updateGlobalRoleValidation;
