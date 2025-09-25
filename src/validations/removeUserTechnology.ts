import { NextFunction, Request, Response } from "express";
import { param } from "express-validator";
import { validateResult } from "../utils";

const removeUserTechnologyValidation = [
  param("userID").isNumeric().withMessage("user 'id' must be a number"),
  param("technologyID")
    .exists()
    .withMessage("technology 'id' must be provided")
    .bail()
    .isNumeric()
    .withMessage("technology 'id' must be a number"),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export default removeUserTechnologyValidation;
