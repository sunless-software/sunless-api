import { NextFunction, Request, Response } from "express";
import { body, param } from "express-validator";
import { validateResult } from "../utils";

const updateBlogValidation = [
  param("projectID").isNumeric().withMessage("project 'id' must be a number"),
  param("blogID").isNumeric().withMessage("blog 'id' must be a number"),
  body("title")
    .optional()
    .isString()
    .withMessage("'title' must be an string")
    .bail()
    .isLength({ min: 1 })
    .withMessage("'title' cannot be empty"),
  body("content")
    .optional()
    .isString()
    .withMessage("'content' must be an string")
    .bail()
    .isLength({ min: 1 })
    .withMessage("'content' cannot be empty"),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export default updateBlogValidation;
