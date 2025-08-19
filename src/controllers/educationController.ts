import { NextFunction, Request, Response } from "express";
import connectToDB from "../db";
import {
  CREATE_EDUCATION,
  DELETE_EDUCATION,
  PATCH_EDUCATION,
} from "../constants/queries";
import {
  HTTP_STATUS_CODE_CREATED,
  HTTP_STATUS_CODE_NOT_FOUND,
} from "../constants/httpStatusCodes";
import { CustomError } from "../interfaces";
import {
  ERROR_TYPE_CREATE_EDUCATION,
  ERROR_TYPE_DELETE_EDUCATION,
  ERROR_TYPE_UPDATE_EDUCATION,
} from "../constants/customErrors";
import {
  DEFAULT_SUCCES_API_RESPONSE,
  EDUCATION_SUCCESSFULLY_CREATED,
  EDUCATION_SUCCESSFULLY_DELETED,
  EDUCATION_SUCCESSFULY_UPDATED,
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
          data: result.rows,
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
  updateEducation: async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { startDate, endDate, institution, field, location, description } =
      req.body;
    const db = await connectToDB();

    try {
      const result = await db.query(PATCH_EDUCATION, [
        startDate,
        endDate,
        institution,
        field,
        location,
        description,
        id,
      ]);
      const affectedRows = result.rowCount;

      if (!affectedRows) {
        throw new Error(HTTP_STATUS_CODE_NOT_FOUND.toString());
      }

      return sendResponse(
        {
          ...DEFAULT_SUCCES_API_RESPONSE,
          message: EDUCATION_SUCCESSFULY_UPDATED,
          data: result.rows,
        },
        res
      );
    } catch (err) {
      const error: CustomError = {
        errorType: ERROR_TYPE_UPDATE_EDUCATION,
        error: err,
      };

      return next(error);
    }
  },
  deleteEducation: async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const db = await connectToDB();

    try {
      const result = await db.query(DELETE_EDUCATION, [id]);
      const affectedRows = result.rowCount;

      if (!affectedRows) {
        throw new Error(HTTP_STATUS_CODE_NOT_FOUND.toString());
      }

      return sendResponse(
        {
          ...DEFAULT_SUCCES_API_RESPONSE,
          message: EDUCATION_SUCCESSFULLY_DELETED,
        },
        res
      );
    } catch (err) {
      const error: CustomError = {
        errorType: ERROR_TYPE_DELETE_EDUCATION,
        error: err,
      };

      return next(error);
    }
  },
};

export default educationController;
