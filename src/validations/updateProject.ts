import { NextFunction, Request, Response } from "express";
import { param, body } from "express-validator";
import { validateResult } from "../utils";
import { PROJECT_STATUS } from "../constants/constants";

const updateProjectsValidation = [
  param("projectID").isNumeric().withMessage("project 'id' must be a number"),
  body("name")
    .optional()
    .isString()
    .withMessage("'name' must be an string")
    .bail()
    .isLength({ min: 1 })
    .withMessage("'name' cannot be empty"),
  body("shortDescriptionUS")
    .optional()
    .isString()
    .withMessage("'shortDescriptionUS' must be an string")
    .bail()
    .isLength({ min: 1 })
    .withMessage("'shortDescriptionUS' cannot be empty")
    .isLength({ max: 64 })
    .withMessage("'shortDescriptionUS' cannot have more than 64 characters"),
  body("shortDescriptionES")
    .optional()
    .isString()
    .withMessage("'shortDescriptionES' must be an string")
    .bail()
    .isLength({ min: 1 })
    .withMessage("'shortDescriptionES' cannot be empty")
    .isLength({ max: 64 })
    .withMessage("'shortDescriptionES' cannot have more than 64 characters"),
  body("longDescriptionUS")
    .optional()
    .isString()
    .withMessage("'longDescriptionUS' must be an string")
    .bail()
    .isLength({ min: 1 })
    .withMessage("'longDescriptionUS' cannot be empty"),
  body("longDescriptionES")
    .optional()
    .isString()
    .withMessage("'longDescriptionES' must be an string")
    .bail()
    .isLength({ min: 1 })
    .withMessage("'longDescriptionES' cannot be empty"),
  body("logo").optional().isURL().withMessage("'logo' must be a valid url"),
  body("status")
    .optional()
    .isIn(PROJECT_STATUS)
    .withMessage(`'status' must be one of: ${PROJECT_STATUS.join(", ")}`),
  body("publicProject")
    .optional()
    .isBoolean()
    .withMessage("'publicProject' must be a boolean"),
  body("startDate")
    .optional()
    .isISO8601()
    .withMessage("'startDate' must be a valid date in format ISO 8601"),
  body("endDate")
    .optional()
    .isISO8601()
    .withMessage("'endDate' must be a valid date in format ISO 8601"),
  body("estimatedEnd")
    .optional()
    .isISO8601()
    .withMessage("'estimatedEnd' must be a valid date in format ISO 8601"),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export default updateProjectsValidation;
