import { NextFunction, Request, Response } from "express";
import { query } from "express-validator";
import { validateResult } from "../utils";

const getUsersValidation = [
  query("offset")
    .optional()
    .isNumeric()
    .withMessage("'offset' must be a number"),
  query("limit").optional().isNumeric().withMessage("'limit' must be a number"),
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
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export default getUsersValidation;
