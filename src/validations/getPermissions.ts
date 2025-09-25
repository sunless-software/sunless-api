import { NextFunction, Request, Response } from "express";
import { query } from "express-validator";
import { validateResult } from "../utils";

const getPermissionsValidation = [
  query("offset")
    .optional()
    .isInt({ min: 0 })
    .withMessage("'offset' must be a non-negative integer"),
  query("limit")
    .optional()
    .isInt({ min: 0 })
    .withMessage("'limit' must be a non-negative integer"),
  query("scope")
    .optional()
    .isIn(["GLOBAL", "PROJECT"])
    .withMessage("'scope' must be one of: 'GLOBAL', 'PROJECT'"),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export default getPermissionsValidation;
