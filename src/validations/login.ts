import { NextFunction, Response, Request } from "express";
import { body } from "express-validator";
import { validateResult } from "../utils";

const authValidation = [
  body("username")
    .exists()
    .withMessage("'username' is required")
    .isString()
    .withMessage("'username' must be a string")
    .isLength({ min: 1 })
    .withMessage("'username' cannot be blank")
    .trim()
    .escape(),
  body("password")
    .optional()
    .isString()
    .withMessage("'password' must be a string")
    .isLength({ min: 1 })
    .withMessage("'password' cannot be blank")
    .trim()
    .escape(),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export default authValidation;
