import { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import { validateResult } from "../utils";

const createUserValidation = [
  body("username")
    .exists()
    .withMessage("username must be provided")
    .isString()
    .withMessage("username must an string")
    .isLength({ min: 1 })
    .withMessage("username cannot be empty")
    .trim()
    .escape(),
  body("password")
    .exists()
    .withMessage("password must be provided")
    .isString()
    .withMessage("password must be an string")
    .isStrongPassword()
    .withMessage(
      "password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character"
    )
    .trim(),
  body("roleID")
    .exists()
    .withMessage("roleID must be provided")
    .isNumeric()
    .withMessage("roleID must be a number"),
  body("profilePhoto")
    .optional()
    .isURL()
    .withMessage("profilePhoto must be a valid url")
    .trim(),
  body("phone")
    .optional()
    .isString()
    .withMessage("phone must be an string")
    .isMobilePhone("any")
    .withMessage("phone must valid phone number")
    .trim()
    .escape(),
  body("email")
    .optional()
    .isString()
    .withMessage("email must be an string")
    .isEmail()
    .withMessage("email must be a valid email")
    .trim()
    .normalizeEmail(),
  body("publicProfile")
    .optional()
    .isBoolean()
    .withMessage("publicProfile must be a boolean"),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export default createUserValidation;
