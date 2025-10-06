import { NextFunction, Request, Response } from "express";
import { query } from "express-validator";
import { validateResult } from "../utils";

const getUsersValidation = [
  query("lang").optional().isIn(["US", "ES"]),
  query("offset")
    .optional()
    .isInt({ min: 0 })
    .withMessage("'offset' must be a non-negative integer"),
  query("limit")
    .optional()
    .isInt({ min: 0 })
    .withMessage("'limit' must be a non-negative integer"),
  query("showPrivateUsers")
    .optional()
    .isBoolean()
    .withMessage("'showPrivateUsers' must be a boolean"),
  query("showBannedUsers")
    .optional()
    .isBoolean()
    .withMessage("'showBannedUsers' must be a boolean"),
  query("showDeletedUsers")
    .optional()
    .isBoolean()
    .withMessage("'showDeletedUsers' must be a boolean"),
  query("username")
    .optional()
    .isString()
    .trim()
    .withMessage("'username' must be an string"),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export default getUsersValidation;
