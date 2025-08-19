import { NextFunction, Request, Response } from "express";
import connectToDB from "../db";
import { CREATE_EDUCATION } from "../constants/queries";
import {
  HTTP_STATUS_CODE_CREATED,
  HTTP_STATUS_CODE_NOT_FOUND,
} from "../constants/httpStatusCodes";
import { CustomError } from "../interfaces";
import { ERROR_TYPE_CREATE_EDUCATION } from "../constants/customErrors";
import {
  DEFAULT_SUCCES_API_RESPONSE,
  EDUCATION_SUCCESSFULLY_CREATED,
} from "../constants/messages";
import { sendResponse } from "../utils";

const educationController = {
  createEducation: async (req: Request, res: Response, next: NextFunction) => {
    const {
      startDate,
      endDate,
      institution,
      field,
      location,
      description,
      userID,
    } = req.body;
    const db = await connectToDB();

    try {
      const result = await db.query(CREATE_EDUCATION, [
        startDate,
        endDate,
        institution,
        field,
        location,
        description,
        userID,
      ]);
      const affectedRows = result.rowCount;

      if (!affectedRows) {
        throw new Error(HTTP_STATUS_CODE_NOT_FOUND.toString());
      }

      return sendResponse(
        {
          ...DEFAULT_SUCCES_API_RESPONSE,
          status: HTTP_STATUS_CODE_CREATED,
          message: EDUCATION_SUCCESSFULLY_CREATED,
        },
        res
      );
    } catch (err) {
      const error: CustomError = {
        errorType: ERROR_TYPE_CREATE_EDUCATION,
        error: err,
      };

      return next(error);
    }
  },
};

export default educationController;
