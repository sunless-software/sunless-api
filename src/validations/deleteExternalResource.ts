import { NextFunction, Request, Response } from "express";
import { param } from "express-validator";
import { validateResult } from "../utils";

const deleteExternalResourceValidation = [
  param("projectID").isNumeric().withMessage("project 'id' must be a number"),
  param("resourceID")
    .isNumeric()
    .withMessage("external resource 'id' must be a number"),
  async (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export default deleteExternalResourceValidation;
