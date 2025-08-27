import { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import { validateResult } from "../utils";

const acceptInvitationValidation = [
  body("code")
    .exists()
    .withMessage("'code' must be provided")
    .bail()
    .isString()
    .withMessage("'code' must be an string")
    .bail()
    .isLength({ min: 1 })
    .withMessage("'code' cannot be empty"),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export default acceptInvitationValidation;
