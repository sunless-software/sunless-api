import { NextFunction, Request, Response } from "express";
import { param, body } from "express-validator";
import { validateResult } from "../utils";

const updatePasswordValidation = [
  param("userID")
    .optional()
    .isNumeric()
    .withMessage("'userID' must be a number"),
  body("newPassword")
    .exists()
    .withMessage("'newPassword' must be provided")
    .isString()
    .withMessage("'newPassword' must be an string")
    .isStrongPassword()
    .withMessage(
      "'newPassword' must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character"
    )
    .trim(),
  body("confirmPassword")
    .exists()
    .withMessage("'confirmPassword' must be provided")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("'confirmPassword' must match 'newPassword'");
      }
      return true;
    }),
  async (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next);
  },
];

export default updatePasswordValidation;
