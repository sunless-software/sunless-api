import { body } from "express-validator";
import { validateResult } from "../utils";
import { Request, Response, NextFunction } from "express";

const createProjectRoleValidation = [
  body("roleName")
    .exists()
    .withMessage("'roleName' must be provided")
    .bail()
    .isString()
    .withMessage("'roleName' must be an string")
    .bail()
    .isLength({ min: 1 })
    .withMessage("'roleName' cannot be empty"),
  body("permissions")
    .exists()
    .withMessage("'permissions' must be provided")
    .bail()
    .isArray({ min: 1 })
    .withMessage("'permissions' must be a non empty array"),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export default createProjectRoleValidation;
