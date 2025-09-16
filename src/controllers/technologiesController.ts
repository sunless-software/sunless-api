import { NextFunction, Request, Response } from "express";
import connectToDB from "../db";
import {
  COUNT_TECHNOLOGIES,
  CREATE_TECHNOLOGY,
  GET_TECHNOLOGIES,
  UPDATE_TECHNOLOGY,
} from "../constants/queries";
import { sendResponse } from "../utils";
import {
  DEFAULT_SUCCES_API_RESPONSE,
  TECHNOLOGIES_SUCCESSFULLY_RETRIEVED_MESSAGE,
  TECHNOLOGY_SUCCESSFULLY_CREATED_MESSAGE,
  TECHNOLOGY_SUCCESSFULLY_UPDATED_MESSAGE,
} from "../constants/messages";
import {
  HTTP_STATUS_CODE_CREATED,
  HTTP_STATUS_CODE_NOT_FOUND,
} from "../constants/httpStatusCodes";

const technologiesController = {
  getTechnologies: async (req: Request, res: Response, next: NextFunction) => {
    const { offset = 0, limit = 20 } = req.query;
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
  createTechnology: async (req: Request, res: Response, next: NextFunction) => {
    const { technologyName } = req.body;
    const db = await connectToDB();

    try {
      const result = await db.query(CREATE_TECHNOLOGY, [technologyName]);

      return sendResponse(
        {
          ...DEFAULT_SUCCES_API_RESPONSE,
          status: HTTP_STATUS_CODE_CREATED,
          message: TECHNOLOGY_SUCCESSFULLY_CREATED_MESSAGE,
          data: result.rows,
        },
        res
      );
    } catch (err) {
      return next(err);
    }
  },
  updateTechnology: async (req: Request, res: Response, next: NextFunction) => {
    const { technologyID } = req.params;
    const { technologyName } = req.body;
    const db = await connectToDB();

    try {
      const result = await db.query(UPDATE_TECHNOLOGY, [
        technologyName,
        technologyID,
      ]);
      const affectedRows = result.rowCount;

      if (!affectedRows) {
        throw new Error(HTTP_STATUS_CODE_NOT_FOUND.toString());
      }

      return sendResponse(
        {
          ...DEFAULT_SUCCES_API_RESPONSE,
          message: TECHNOLOGY_SUCCESSFULLY_UPDATED_MESSAGE,
          data: result.rows,
        },
        res
      );
    } catch (err) {
      return next(err);
    }
  },
};

export default technologiesController;
