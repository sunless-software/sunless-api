import { param, body } from "express-validator";
import { MEDIA_TPYES } from "../constants/constants";
import { NextFunction, Request, Response } from "express";
import { validateResult } from "../utils";

const updateProjectMediaValidation = [
  param("projectID").isNumeric().withMessage("project 'id' must be a number"),
  param("mediaID").isNumeric().withMessage("media 'id' must be a number"),
  body("url").optional().isURL().withMessage("media 'url' must be a valid url"),
  body("type")
    .optional()
    .isIn(MEDIA_TPYES)
    .withMessage(`media 'type' must be one of: ${MEDIA_TPYES.join(", ")}`),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export default updateProjectMediaValidation;
