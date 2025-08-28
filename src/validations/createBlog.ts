import { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import { validateResult } from "../utils";

const createBlogValidation = [
  body("projectID")
    .exists()
    .withMessage("'projectID' must be provided")
    .bail()
    .isNumeric()
    .withMessage("'projectID' must be a number"),
  body("title")
    .exists()
    .withMessage("'title' must be provided")
    .bail()
    .isString()
    .withMessage("'title' must be an string")
    .bail()
    .isLength({ min: 1 })
    .withMessage("'title' cannot be empty"),
  body("content")
    .exists()
    .withMessage("'content' must be provided")
    .bail()
    .isString()
    .withMessage("'content' must be an string")
    .bail()
    .isLength({ min: 1 })
    .withMessage("'content' cannot be empty"),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export default createBlogValidation;
