import { NextFunction, Request, Response } from "express";
import connectToDB from "../db";
import { COUNT_PERMISSIONS, GET_PERMISSIONS } from "../constants/queries";
import { sendResponse } from "../utils";
import {
  DEFAULT_SUCCES_API_RESPONSE,
  PERMISSIONS_SUCCESSFULLY_RETRIEVED,
} from "../constants/messages";

const permissionsController = {
  getPermissions: async (req: Request, res: Response, next: NextFunction) => {
    const { offset = 0, limit = 20, scope } = req.query;
    const db = await connectToDB();

    try {
      const [resultPermissions, countPermissions] = await Promise.all([
        db.query(GET_PERMISSIONS, [scope, offset, limit]),
        db.query(COUNT_PERMISSIONS, [scope]),
      ]);

      return sendResponse(
        {
          ...DEFAULT_SUCCES_API_RESPONSE,
          message: PERMISSIONS_SUCCESSFULLY_RETRIEVED,
          data: resultPermissions.rows,
          pagination: {
            offset:
              typeof offset === "string"
                ? parseInt(offset)
                : (offset as number),
            limit:
              typeof limit === "string" ? parseInt(limit) : (limit as number),
            count: resultPermissions.rows.length,
            total: parseInt(countPermissions.rows[0].total),
          },
        },
        res
      );
    } catch (err) {
      console.log(err);
      return next(err);
    }
  },
};

export default permissionsController;
