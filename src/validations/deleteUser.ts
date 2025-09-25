import { NextFunction, Request, Response } from "express";
import { param } from "express-validator";
import { validateResult } from "../utils";

const deleteUserValidation = [
  param("userID").isNumeric().withMessage("user 'id' must be a number"),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export default deleteUserValidation;
