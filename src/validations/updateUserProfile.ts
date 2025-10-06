import { NextFunction, Request, Response } from "express";
import { param, body } from "express-validator";
import { validateResult } from "../utils";

const updateUserProfileValidation = [
  param("userID").isNumeric().withMessage("user 'id' must be provided"),
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
  body("repoUrl")
    .optional()
    .isURL()
    .withMessage("'repoUrl' must be a valid url"),
  body("websiteUrl")
    .optional()
    .isURL()
    .withMessage("'websiteUrl' must be a valid url"),
  body("linkedinUrl")
    .optional()
    .isURL()
    .withMessage("'linkedinUrl' must be a valid url"),
  body("locationUS")
    .optional()
    .isString()
    .withMessage("'locationUS' must be an string")
    .bail()
    .isLength({ min: 1 })
    .withMessage("'locationUS' cannot be empty")
    .bail()
    .isLength({ max: 100 })
    .withMessage("'locationUS' cannot be longer than 100 characters"),
  body("locationES")
    .optional()
    .isString()
    .withMessage("'locationES' must be an string")
    .bail()
    .isLength({ min: 1 })
    .withMessage("'locationES' cannot be empty")
    .bail()
    .isLength({ max: 100 })
    .withMessage("'locationES' cannot be longer than 100 characters"),
  async (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export default updateUserProfileValidation;
