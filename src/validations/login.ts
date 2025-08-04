import { NextFunction, Response, Request } from "express";
import { body } from "express-validator";
import { validateResult } from "../utils";

const USERNAME_EXISTS_VALIDATION_MSG = "username is required";
const USERNAME_IS_STRING_VALIDATION_MSG = "username must be a string";
const USERNAME_LENGHT_VALIDATION_MSG = "username cannot be blank";
const PASSWORD_IS_STRING_VALIDATION_MSG = "password must be a string.";
const PASSWORD_LENGHT_VALIDATION_MSG = "password cannot be blank";

const authValidation = [
  body("username")
    .exists()
    .withMessage(USERNAME_EXISTS_VALIDATION_MSG)
    .isString()
    .withMessage(USERNAME_IS_STRING_VALIDATION_MSG)
    .isLength({ min: 1 })
    .withMessage(USERNAME_LENGHT_VALIDATION_MSG)
    .trim()
    .escape(),
  body("password")
    .optional()
    .isString()
    .withMessage(PASSWORD_IS_STRING_VALIDATION_MSG)
    .isLength({ min: 1 })
    .withMessage(PASSWORD_LENGHT_VALIDATION_MSG)
    .trim()
    .escape(),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export default authValidation;
