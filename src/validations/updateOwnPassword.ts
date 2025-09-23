import { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import { validateResult } from "../utils";

const updateOwnPasswordValidation = [
  body("currentPassword")
    .exists()
    .withMessage("'currentPassword' must be provided")
    .bail()
    .isString()
    .withMessage("'currentPassword' must be an string")
    .bail()
    .isLength({ min: 1 })
    .withMessage("'currentMessage' cannot be empty"),
  body("newPassword")
    .exists()
    .withMessage("'newPassword' must be provided")
    .isString()
    .withMessage("'newPassword' must be an string")
    .isStrongPassword()
    .withMessage(
      "'newPassword' must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character"
    )
    .custom((value, { req }) => {
      if (value === req.body.currentPassword) {
        throw new Error(
          "the new password cannot be the same as the old password"
        );
      }

      return true;
    })
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

export default updateOwnPasswordValidation;
