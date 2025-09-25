import { NextFunction, Request, Response } from "express";
import { param, body } from "express-validator";
import { validateResult } from "../utils";

const addProjectTagValidation = [
  param("projectID").isNumeric().withMessage("project 'id' must be a number"),
  body("tagID")
    .exists()
    .withMessage("tag 'id' must be provided")
    .bail()
    .isNumeric()
    .withMessage("tag 'id' must be a number"),
  async (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export default addProjectTagValidation;
