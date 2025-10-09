import { NextFunction, Request, Response } from "express";
import { param, query } from "express-validator";
import { validateResult } from "../utils";

const getProjectsFromUserValidation = [
  param("userID").isNumeric().withMessage("user 'id' must be a number"),
  query("lang").optional().isIn(["US", "ES"]),
  query("offset")
    .optional()
    .isInt({ min: 0 })
    .withMessage("'offset' must be a non-negative integer"),
  query("limit")
    .optional()
    .isInt({ min: 0 })
    .withMessage("'limit' must be a non-negative integer"),
  query("showPrivateProjects")
    .optional()
    .isBoolean()
    .withMessage("'showPrivateProjects' must be a boolean"),
  query("tags")
    .optional()
    .custom((value) => {
      const parts = value.split(",").map((s: string) => s.trim());
      if (parts.every((p: string) => /^\d+$/.test(p))) {
        return true;
      }
      throw new Error("'tags' must be a comma-separated list of integers");
    }),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export default getProjectsFromUserValidation;
