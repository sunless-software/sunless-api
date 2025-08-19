import { Request, Response, NextFunction } from "express";
import { body } from "express-validator";
import { validateResult } from "../utils";

const createEducationValidation = [
  body("userID")
    .optional()
    .isNumeric()
    .withMessage("'userID' must be a number"),
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
  body("institution")
    .exists()
    .withMessage("'institution' must be provided")
    .bail()
    .isString()
    .withMessage("'institution' must be an string")
    .bail()
    .isLength({ min: 1 })
    .withMessage("'institution' cannot be empty"),
  body("field")
    .exists()
    .withMessage("'field' must be provided")
    .bail()
    .isString()
    .withMessage("'field' must be an string")
    .bail()
    .isLength({ min: 1 })
    .withMessage("'field' cannot be empty"),
  body("location")
    .exists()
    .withMessage("'location' must be provided")
    .bail()
    .isString()
    .withMessage("'location' must be an string")
    .bail()
    .isLength({ min: 1 })
    .withMessage("'location' cannot be empty"),
  body("description")
    .optional()
    .isString()
    .withMessage("'description' must be an string")
    .bail()
    .isLength({ min: 1 })
    .withMessage("'description' cannot be empty"),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export default createEducationValidation;
