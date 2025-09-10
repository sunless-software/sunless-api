import { NextFunction, Request, Response } from "express";
import connectToDB from "../db";
import {
  ADD_PROJECT_TECHNOLOGY,
  ADD_USER_TECHNOLOGY,
  REMOVE_PROJECT_TECHNOLOGY,
  REMOVE_USER_TECHNOLOGY,
} from "../constants/queries";
import {
  HTTP_STATUS_CODE_CREATED,
  HTTP_STATUS_CODE_NOT_FOUND,
} from "../constants/httpStatusCodes";
import { sendResponse } from "../utils";
import {
  DEFAULT_SUCCES_API_RESPONSE,
  PROJECT_TECHNOLOGY_SUCCESSFULLY_ADDED,
  PROJECT_TECHNOLOGY_SUCCESSFULLY_REMOVED,
  USER_TECHNOLOGY_SUCCESSFULLY_ADDED,
  USER_TECHNOLOGY_SUCCESSFULLY_REMOVED,
} from "../constants/messages";

const userTechnologiesController = {
  addUserTechnology: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { userID } = req.params;
    const { technologyID } = req.body;
    const db = await connectToDB();

    try {
      const result = await db.query(ADD_USER_TECHNOLOGY, [
        userID,
        technologyID,
      ]);
      const affectedRows = result.rowCount;

      if (!affectedRows) {
        throw new Error(HTTP_STATUS_CODE_NOT_FOUND.toString());
      }

      return sendResponse(
        {
          ...DEFAULT_SUCCES_API_RESPONSE,
          status: HTTP_STATUS_CODE_CREATED,
          message: USER_TECHNOLOGY_SUCCESSFULLY_ADDED,
          data: result.rows,
        },
        res
      );
    } catch (err) {
      return next(err);
    }
  },
  removeUserTechnology: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { userID, technologyID } = req.params;
    const db = await connectToDB();

    try {
      const result = await db.query(REMOVE_USER_TECHNOLOGY, [
        userID,
        technologyID,
      ]);
      const affectedRows = result.rowCount;

      if (!affectedRows) {
        throw new Error(HTTP_STATUS_CODE_NOT_FOUND.toString());
      }

      return sendResponse(
        {
          ...DEFAULT_SUCCES_API_RESPONSE,
          message: USER_TECHNOLOGY_SUCCESSFULLY_REMOVED,
        },
        res
      );
    } catch (err) {
      return next(err);
    }
  },
  addProjectTechnology: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { projectID } = req.params;
    const { technologyID } = req.body;
    const db = await connectToDB();

    try {
      const result = await db.query(ADD_PROJECT_TECHNOLOGY, [
        projectID,
        technologyID,
      ]);
      const affectedRows = result.rowCount;

      if (!affectedRows) {
        throw new Error(HTTP_STATUS_CODE_NOT_FOUND.toString());
      }

      return sendResponse(
        {
          ...DEFAULT_SUCCES_API_RESPONSE,
          status: HTTP_STATUS_CODE_CREATED,
          message: PROJECT_TECHNOLOGY_SUCCESSFULLY_ADDED,
          data: result.rows,
        },
        res
      );
    } catch (err) {
      return next(err);
    }
  },
  removeProjectTechnology: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { projectID } = req.params;
    const { technologyID } = req.query;

    const db = await connectToDB();

    try {
      const result = await db.query(REMOVE_PROJECT_TECHNOLOGY, [
        projectID,
        technologyID,
      ]);
      const affectedRows = result.rowCount;

      if (!affectedRows) {
        throw new Error(HTTP_STATUS_CODE_NOT_FOUND.toString());
      }

      return sendResponse(
        {
          ...DEFAULT_SUCCES_API_RESPONSE,
          message: PROJECT_TECHNOLOGY_SUCCESSFULLY_REMOVED,
        },
        res
      );
    } catch (err) {
      return next(err);
    }
  },
};

export default userTechnologiesController;
