import { NextFunction, Request, Response } from "express";
import { param } from "express-validator";
import { validateResult } from "../utils";

const deleteEducationValidation = [
  param("userID").isNumeric().withMessage("user 'id' must be a number"),
  param("educationID")
    .isNumeric()
    .withMessage("education 'id' must be a number"),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export default deleteEducationValidation;
