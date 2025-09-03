import { Request, Response, NextFunction } from "express";
import { query } from "express-validator";
import { validateResult } from "../utils";

const getProjectsValidation = [
  query("offset")
    .optional()
    .isNumeric()
    .withMessage("'offset' must be a number"),
  query("limit").optional().isNumeric().withMessage("'limit' must be a number"),
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

export default getProjectsValidation;
