import { NextFunction, Request, Response } from "express";
import { query, param } from "express-validator";
import { validateResult } from "../utils";

const getUserDetailsValidation = [
  param("userID").isNumeric().withMessage("user 'id' must be a number"),
  query("lang").optional().isIn(["US", "ES"]),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export default getUserDetailsValidation;
