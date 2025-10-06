import { Request, Response, NextFunction } from "express";
import { body, param } from "express-validator";
import { validateResult } from "../utils";

const createExperienceValidation = [
  param("userID").isNumeric().withMessage("user 'id' must be a number"),
  body("companyName")
    .exists()
    .withMessage("'companyName' must be provided")
    .bail()
    .isString()
    .withMessage("'companyName' must be an string")
    .bail()
    .isLength({ min: 1 })
    .withMessage("'companyName' cannot be empty"),
  body("roleUS")
    .exists()
    .withMessage("'roleUS' must be provided")
    .bail()
    .isString()
    .withMessage("'roleUS' must be an string")
    .bail()
    .isLength({ min: 1 })
    .withMessage("'roleUS' cannot be empty"),
  body("roleES")
    .optional()
    .isString()
    .withMessage("'roleES' must be an string")
    .bail()
    .isLength({ min: 1 })
    .withMessage("'roleES' cannot be empty"),
  body("descriptionUS")
    .exists()
    .withMessage("'descriptionUS' must be provided")
    .bail()
    .isString()
    .withMessage("'descriptionUS' must be an string")
    .bail()
    .isLength({ min: 1 })
    .withMessage("'descriptionUS' cannot be empty"),
  body("descriptionES")
    .optional()
    .isString()
    .withMessage("'descriptionES' must be an string")
    .bail()
    .isLength({ min: 1 })
    .withMessage("'descriptionES' cannot be empty"),
  body("locationUS")
    .exists()
    .withMessage("'locationUS' must be provided")
    .bail()
    .isString()
    .withMessage("'locationUS' must be an string")
    .bail()
    .isLength({ min: 1 })
    .withMessage("'locationUS' cannot be empty"),
  body("locationES")
    .optional()
    .isString()
    .withMessage("'locationES' must be an string")
    .bail()
    .isLength({ min: 1 })
    .withMessage("'locationES' cannot be empty"),
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
