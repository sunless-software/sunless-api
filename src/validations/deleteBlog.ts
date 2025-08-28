import { NextFunction, Request, Response } from "express";
import { param } from "express-validator";
import { validateResult } from "../utils";

const deleteBlogValidation = [
  param("id").isNumeric().withMessage("blog 'id' must be a number"),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export default deleteBlogValidation;
