import { Request, Response, NextFunction } from "express";
import { body } from "express-validator";
import { validateResult } from "../utils";

const createExperienceValidation = [
  body("userID")
    .exists()
    .withMessage("'userID' must be provided")
    .bail()
    .isNumeric()
    .withMessage("'userID' must be a number"),
  body("companyName")
    .exists()
    .withMessage("'companyName' must be provided")
    .bail()
    .isString()
    .withMessage("'companyName' must be an string")
    .bail()
    .isLength({ min: 1 })
    .withMessage("'companyName' cannot be empty"),
  body("role")
    .exists()
    .withMessage("'role' must be provided")
    .bail()
    .isString()
    .withMessage("'role' must be an string")
    .bail()
    .isLength({ min: 1 })
    .withMessage("'role' cannot be empty"),
  body("description")
    .exists()
    .withMessage("'description' must be provided")
    .bail()
    .isString()
    .withMessage("'description' must be an string")
    .bail()
    .isLength({ min: 1 })
    .withMessage("'description' cannot be empty"),
  body("location")
    .exists()
    .withMessage("'location' must be provided")
    .bail()
    .isString()
    .withMessage("'location' must be an string")
    .bail()
    .isLength({ min: 1 })
    .withMessage("'location' cannot be empty"),
  body("startDate")
    .exists()
    .withMessage("'startDate' must be provided")
    .bail()
    .isString()
    .withMessage("'startDate' must be a string")
    .bail()
    .isLength({ min: 1 })
    .withMessage("'startDate' cannot be empty")
    .bail()
    .isISO8601()
    .withMessage("'startDate' must be a valid date in format ISO 8601"),
  body("endDate")
    .optional()
    .isString()
    .withMessage("'endDate' must be a string")
    .bail()
    .isLength({ min: 1 })
    .withMessage("'endDate' cannot be empty")
    .bail()
    .isISO8601()
    .withMessage("'endDate' must be a valid date in format ISO 8601"),
  body("companyLogo")
    .optional()
    .isString()
    .withMessage("'companyLogo' must be a string")
    .bail()
    .isURL()
    .withMessage("'companyLogo' must be a valid url"),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export default createExperienceValidation;
