import { NextFunction, Request, Response } from "express";
import { param, body } from "express-validator";
import { TECHNOLOGY_TYPES } from "../constants/constants";
import { validateResult } from "../utils";

const updateTechnologyValidation = [
  param("technologyID")
    .isNumeric()
    .withMessage("technology 'id' must be a number"),
  body("technologyName")
    .exists()
    .withMessage("'technologyName' must be provided")
    .bail()
    .isString()
    .withMessage("'technologyName' must be an string")
    .bail()
    .isLength({ min: 1 })
    .withMessage("'technologyName' cannot be empty"),
  body("technologyType")
    .optional()
    .isIn(TECHNOLOGY_TYPES)
    .withMessage(
      `'technologyType' must be one of: ${TECHNOLOGY_TYPES.join(", ")}`
    ),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export default updateTechnologyValidation;
