import { NextFunction, Request, Response } from "express";
import { body, param } from "express-validator";
import { validateResult } from "../utils";

const updateBlogValidation = [
  param("id").isNumeric().withMessage("blog 'id' must be a number"),
  body("name")
    .optional()
    .isString()
    .withMessage("'name' must be an string")
    .bail()
    .isLength({ min: 1 })
    .withMessage("'name' cannot be empty"),
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
