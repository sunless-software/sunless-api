import { Request, Response, NextFunction } from "express";
import { param } from "express-validator";
import { validateResult } from "../utils";

const removeProjectTagValidation = [
  param("projectID").isNumeric().withMessage("'projectID' must be a number"),
  param("tagID").isNumeric().withMessage("'tagID' must be a number"),
  async (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export default removeProjectTagValidation;
