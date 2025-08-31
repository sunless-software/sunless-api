import { param, body } from "express-validator";
import { MEDIA_TPYES } from "../constants/constants";
import { NextFunction, Request, Response } from "express";
import { validateResult } from "../utils";

const createProjectMediaValidation = [
  param("projectID").isNumeric().withMessage("project 'id' must be a number"),
  body("url")
    .exists()
    .withMessage("media 'url' must be provided")
    .bail()
    .isURL()
    .withMessage("media 'url' must be a valid url"),
  body("type")
    .exists()
    .withMessage("media 'type' must be provided")
    .isIn(MEDIA_TPYES)
    .withMessage(`media 'type' must be one of: ${MEDIA_TPYES.join(", ")}`),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export default createProjectMediaValidation;
