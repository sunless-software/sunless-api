import { NextFunction, Request, Response } from "express";
import { body, param } from "express-validator";
import { validateResult } from "../utils";

const createProjectInvitationValidation = [
  param("id").isNumeric().withMessage("project 'id' must be a number"),
  body("userID")
    .exists()
    .withMessage("'userID' must be provided")
    .bail()
    .isNumeric()
    .withMessage("'userID' must be a number"),
  body("projectRoleID")
    .exists()
    .withMessage("'projectRoleID' must be provided")
    .bail()
    .isNumeric()
    .withMessage("'projectRoleID' must be a number"),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export default createProjectInvitationValidation;
