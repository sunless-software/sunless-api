import { Request, Response, NextFunction } from "express";
import { param } from "express-validator";
import { validateResult } from "../utils";

const deleteProjectMediaValidation = [
  param("projectID").isNumeric().withMessage("project 'id' must be a number"),
  param("mediaID").isNumeric().withMessage("media 'id' must be a number"),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export default deleteProjectMediaValidation;
