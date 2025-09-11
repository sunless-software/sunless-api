import { NextFunction, Request, Response } from "express";
import { body, param } from "express-validator";
import { validateResult } from "../utils";

const updateUserValidation = [
  param("userID").isNumeric().withMessage("user 'id' must be a number"),
  body("username")
    .optional()
    .isString()
    .withMessage("username must an string")
    .isLength({ min: 1 })
    .withMessage("username cannot be empty")
    .trim()
    .escape(),
  body("roleID").optional().isNumeric().withMessage("roleID must be a number"),
  body("jobTitle")
    .optional()
    .isString()
    .withMessage("'jobTitle' must be an string")
    .isLength({ min: 1 })
    .withMessage("'jobTitle' cannot be empty")
    .isLength({ max: 60 })
    .withMessage("'jobTitle' cannot be longer than 60 characters"),
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
  body("shortDescription")
    .optional()
    .isString()
    .withMessage("'shortDescription' must be an string")
    .isLength({ min: 1 })
    .withMessage("'shortDescription' cannot be empty")
    .isLength({ max: 80 })
    .withMessage("'shortDescription' cannot be longer than 80 characters"),
  body("publicProfile")
    .optional()
    .isBoolean()
    .withMessage("publicProfile must be a boolean"),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export default updateUserValidation;
