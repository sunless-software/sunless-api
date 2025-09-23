import { NextFunction, Request, Response } from "express";
import connectToDB from "../db";
import {
  CREATE_PROJECT_ROLE,
  RELATE_PROJECT_ROLE_PERMISSIONS,
} from "../constants/queries";
import { sendResponse } from "../utils";
import {
  DEFAULT_SUCCES_API_RESPONSE,
  PROJECT_ROLE_SUCCESSFULLY_CREATED,
} from "../constants/messages";
import { HTTP_STATUS_CODE_CREATED } from "../constants/httpStatusCodes";

const projectRolesController = {
  createProjectRole: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { roleName, permissions } = req.body;
    const db = await connectToDB();

    try {
      await db.query("BEGIN");
      const resultProjectRole = await db.query(CREATE_PROJECT_ROLE, [roleName]);
      const newProjectRole = resultProjectRole.rows[0];
      const resultPermissions = await db.query(
        RELATE_PROJECT_ROLE_PERMISSIONS,
        [newProjectRole.id, permissions]
      );
      const newRolePermissions = resultPermissions.rows.map(
        (p) => p.permission_id
      );

      await db.query("COMMIT");

      return sendResponse(
        {
          ...DEFAULT_SUCCES_API_RESPONSE,
          status: HTTP_STATUS_CODE_CREATED,
          message: PROJECT_ROLE_SUCCESSFULLY_CREATED,
          data: { ...newProjectRole, permissions: newRolePermissions },
        },
        res
      );
    } catch (err) {
      await db.query("ROLLBACK");
      return next(err);
    }
  },
};

export default projectRolesController;
