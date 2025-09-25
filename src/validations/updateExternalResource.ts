import { param, body } from "express-validator";
import { EXTERNAL_RESOURCE_TYPES } from "../constants/constants";
import { Request, Response, NextFunction } from "express";
import { validateResult } from "../utils";

const updateExternalResourceValidation = [
  param("projectID").isNumeric().withMessage("project 'id' must be a number"),
  param("resourceID")
    .isNumeric()
    .withMessage("external resource 'id' must be a number"),
  body("name")
    .optional()
    .isString()
    .withMessage("external resource 'name' must be an string")
    .bail()
    .isLength({ min: 1 })
    .withMessage("external resource 'name' cannot be empty"),
  body("url")
    .optional()
    .isURL()
    .withMessage("external resource 'url' must be a valid url"),
  body("type")
    .optional()
    .isIn(EXTERNAL_RESOURCE_TYPES)
    .withMessage(
      `external resource 'type' must be one of: ${EXTERNAL_RESOURCE_TYPES.join(
        ", "
      )}`
    ),
  async (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export default updateExternalResourceValidation;
