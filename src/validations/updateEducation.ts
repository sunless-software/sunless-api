import { Request, Response, NextFunction } from "express";
import { body, param } from "express-validator";
import { validateResult } from "../utils";

const updateEducationValidation = [
  param("userID").isNumeric().withMessage("user 'id' must be a number"),
  param("educationID")
    .isNumeric()
    .withMessage("education 'id' must be a number"),
  body("startDate")
    .optional()
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
    .optional()
    .isString()
    .withMessage("'institution' must be an string")
    .bail()
    .isLength({ min: 1 })
    .withMessage("'institution' cannot be empty"),
  body("fieldUS")
    .optional()
    .isString()
    .withMessage("'fieldUS' must be an string")
    .bail()
    .isLength({ min: 1 })
    .withMessage("'fieldUS' cannot be empty"),
  body("fieldES")
    .optional()
    .isString()
    .withMessage("'fieldES' must be an string")
    .bail()
    .isLength({ min: 1 })
    .withMessage("'fieldES' cannot be empty"),
  body("locationUS")
    .optional()
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
  body("descriptionUS")
    .optional()
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
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export default updateEducationValidation;
