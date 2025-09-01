import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../interfaces";
import connectToDB from "../db";
import {
  ADD_PROJECT_TECHNOLOGY,
  ADD_USER_TECHNOLOGY,
  COUNT_TECHNOLOGIES,
  GET_TECHNOLOGIES,
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
  TECHNOLOGIES_SUCCESSFULLY_RETRIEVED_MESSAGE,
  USER_TECHNOLOGY_SUCCESSFULLY_ADDED,
  USER_TECHNOLOGY_SUCCESSFULLY_REMOVED,
} from "../constants/messages";
import { GET_TECHNOLOGIES_DEFAULT_LIMIT } from "../constants/setup";

const technologiesController = {
  getTechnologies: async (req: Request, res: Response, next: NextFunction) => {
    const { offset = 0, limit = GET_TECHNOLOGIES_DEFAULT_LIMIT } = req.query;
    const db = await connectToDB();

    try {
      const [countTechnologiesResult, getTechnologiesResult] =
        await Promise.all([
          db.query(COUNT_TECHNOLOGIES),
          db.query(GET_TECHNOLOGIES, [offset, limit]),
        ]);
      const technologies = getTechnologiesResult.rows;

      return sendResponse(
        {
          ...DEFAULT_SUCCES_API_RESPONSE,
          message: TECHNOLOGIES_SUCCESSFULLY_RETRIEVED_MESSAGE,
          data: technologies,
          pagination: {
            offset:
              typeof offset === "string"
                ? parseInt(offset)
                : (offset as number),
            limit:
              typeof limit === "string" ? parseInt(limit) : (limit as number),
            count: technologies.length,
            total: parseInt(countTechnologiesResult.rows[0].total),
          },
        },
        res
      );
    } catch (err) {
      return next(err);
    }
  },
  addUserTechnology: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const authID = (req as AuthRequest).user.id;
    const { technologyID } = req.body;
    const userID = req.body.userID || authID;
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
    const authID = (req as AuthRequest).user.id;
    const technologyID = req.params.id;
    const userID = req.query.id || authID;
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

export default technologiesController;
