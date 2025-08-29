import { param, body } from "express-validator";
import { EXTERNAL_RESOURCE_TYPES } from "../constants/constants";
import { NextFunction, Request, Response } from "express";
import { validateResult } from "../utils";

const addExternalResourceValidation = [
  param("projectID").isNumeric().withMessage("'projectID' must be a number"),
  body("name")
    .exists()
    .withMessage("external resource 'name' must be provided")
    .bail()
    .isString()
    .withMessage("external resource 'name' must be an string")
    .bail()
    .isLength({ min: 1 })
    .withMessage("external resource 'name' cannot be empty"),
  body("url")
    .exists()
    .withMessage("external resource 'url' must be provided")
    .bail()
    .isURL()
    .withMessage("external resource 'url' must be a valid url"),
  body("type")
    .exists()
    .withMessage("external resource 'type' must be provided")
    .bail()
    .isIn(EXTERNAL_RESOURCE_TYPES)
    .withMessage(
      `external resource 'type' must be one of: ${EXTERNAL_RESOURCE_TYPES.join(
        ", "
      )}`
    ),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export default addExternalResourceValidation;
