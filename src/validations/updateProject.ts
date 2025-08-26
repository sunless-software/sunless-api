import { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import { validateResult } from "../utils";
import { PROJECT_STATUS } from "../constants/constants";

const updateProjectsValidation = [
  body("name")
    .optional()
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
