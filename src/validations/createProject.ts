import { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import { validateResult } from "../utils";
import { PROJECT_STATUS } from "../constants/constants";

const createProjectsValidation = [
  body("name")
    .exists()
    .withMessage("'name' must be provided")
    .bail()
    .isString()
    .withMessage("'name' must be an string")
    .bail()
    .isLength({ min: 1 })
    .withMessage("'name' cannot be empty"),
  body("description")
    .optional()
    .isString()
    .withMessage("'description' must be an string")
    .bail()
    .isLength({ min: 1 })
    .withMessage("'description' cannot be empty"),
  body("status")
    .exists()
    .withMessage("'status must be provided'")
    .bail()
    .isIn(PROJECT_STATUS)
    .withMessage(`'status' must be one of: ${PROJECT_STATUS.join(", ")}`),
  body("publicProject")
    .exists()
    .withMessage("'publicProject' must be provided")
    .bail()
    .isBoolean()
    .withMessage("'publicProject' must be a boolean"),
  body("startDate")
    .exists()
    .withMessage("'startDate' must be provided")
    .bail()
    .isISO8601()
    .withMessage("'startDate' must be a valid date in format ISO 8601"),
  body("endDate")
    .optional()
    .isISO8601()
    .withMessage("'endDate' must be a valid date in format ISO 8601"),
  body("estimatedEndDate")
    .optional()
    .isISO8601()
    .withMessage("'estimatedEndDate' must be a valid date in format ISO 8601"),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export default createProjectsValidation;
