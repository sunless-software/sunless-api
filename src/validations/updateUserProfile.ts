import { NextFunction, Request, Response } from "express";
import { param, body } from "express-validator";
import { validateResult } from "../utils";

const updateUserProfileValidation = [
  param("userID").isNumeric().withMessage("user 'id' must be provided"),
  body("longDescription")
    .optional()
    .isString()
    .withMessage("'longDescription' must be an string")
    .bail()
    .isLength({ min: 1 })
    .withMessage("'longDescription' cannot be empty"),
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
  body("location")
    .optional()
    .isString()
    .withMessage("'location' must be an string")
    .bail()
    .isLength({ min: 1 })
    .withMessage("'location' cannot be empty")
    .bail()
    .isLength({ max: 100 })
    .withMessage("'location' cannot be longer than 100 characters"),
  async (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export default updateUserProfileValidation;
