import { Request, Response, NextFunction } from "express";
import connectToDB from "../db";
import {
  CREATE_EXPERIENCE,
  DELETE_EXPERIENCE,
  PATCH_EXPERIENCE,
} from "../constants/queries";
import {
  HTTP_STATUS_CODE_CREATED,
  HTTP_STATUS_CODE_NOT_FOUND,
} from "../constants/httpStatusCodes";
import { CustomError } from "../interfaces";
import {
  ERROR_TYPE_CREATE_EXPERIENCE,
  ERROR_TYPE_DELETE_EXPERIENCE,
  ERROR_TYPE_UPDATE_EXPERIENCE,
} from "../constants/customErrors";
import { sendResponse } from "../utils";
import {
  DEFAULT_SUCCES_API_RESPONSE,
  EXPERIENCE_SUCCESSFULLY_CREATED,
  EXPERIENCE_SUCCESSFULLY_DELETED_MESSAGE,
  EXPERIENCE_SUCCESSFULY_UPDATED,
} from "../constants/messages";

const experiencesController = {
  createExperience: async (req: Request, res: Response, next: NextFunction) => {
    const {
      companyName,
      role,
      description,
      location,
      startDate,
      endDate = null,
      companyLogo = null,
      userID,
    } = req.body;
    const db = await connectToDB();

    try {
      const result = await db.query(CREATE_EXPERIENCE, [
        companyName,
        role,
        description,
        location,
        startDate,
        endDate,
        companyLogo,
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
          message: EXPERIENCE_SUCCESSFULLY_CREATED,
          data: result.rows,
        },
        res
      );
    } catch (err) {
      const error: CustomError = {
        errorType: ERROR_TYPE_CREATE_EXPERIENCE,
        error: err,
      };

      return next(error);
    }
  },
  updateExperience: async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const {
      companyName,
      role,
      description,
      location,
      startDate,
      endDate,
      companyLogo,
    } = req.body;
    const db = await connectToDB();

    try {
      const result = await db.query(PATCH_EXPERIENCE, [
        companyName,
        role,
        description,
        location,
        startDate,
        endDate,
        companyLogo,
        id,
      ]);
      const affectedRows = result.rowCount;

      if (!affectedRows) {
        throw new Error(HTTP_STATUS_CODE_NOT_FOUND.toString());
      }

      return sendResponse(
        {
          ...DEFAULT_SUCCES_API_RESPONSE,
          message: EXPERIENCE_SUCCESSFULY_UPDATED,
          data: result.rows,
        },
        res
      );
    } catch (err) {
      const error: CustomError = {
        errorType: ERROR_TYPE_UPDATE_EXPERIENCE,
        error: err,
      };

      return next(error);
    }
  },
  deleteExperience: async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const db = await connectToDB();

    try {
      const result = await db.query(DELETE_EXPERIENCE, [id]);
      const affectedRows = result.rowCount;

      if (!affectedRows) {
        throw new Error(HTTP_STATUS_CODE_NOT_FOUND.toString());
      }

      return sendResponse(
        {
          ...DEFAULT_SUCCES_API_RESPONSE,
          message: EXPERIENCE_SUCCESSFULLY_DELETED_MESSAGE,
        },
        res
      );
    } catch (err) {
      const error: CustomError = {
        errorType: ERROR_TYPE_DELETE_EXPERIENCE,
        error: err,
      };

      return next(error);
    }
  },
};

export default experiencesController;
