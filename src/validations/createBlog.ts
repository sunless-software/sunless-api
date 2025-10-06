import { NextFunction, Request, Response } from "express";
import { body, param } from "express-validator";
import { validateResult } from "../utils";

const createBlogValidation = [
  param("projectID").isNumeric().withMessage("'projectID' must be a number"),
  body("titleUS")
    .exists()
    .withMessage("'titleUS' must be provided")
    .bail()
    .isString()
    .withMessage("'titleUS' must be an string")
    .bail()
    .isLength({ min: 1 })
    .withMessage("'titleUS' cannot be empty"),
  body("titleES")
    .optional()
    .isString()
    .withMessage("'titleES' must be an string")
    .bail()
    .isLength({ min: 1 })
    .withMessage("'titleES' cannot be empty"),
  body("contentUS")
    .exists()
    .withMessage("'contentUS' must be provided")
    .bail()
    .isString()
    .withMessage("'contentUS' must be an string")
    .bail()
    .isLength({ min: 1 })
    .withMessage("'contentUS' cannot be empty"),
  body("contentES")
    .optional()
    .isString()
    .withMessage("'contentES' must be an string")
    .bail()
    .isLength({ min: 1 })
    .withMessage("'contentES' cannot be empty"),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export default createBlogValidation;
