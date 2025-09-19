import { NextFunction, Request, Response } from "express";
import connectToDB from "../db";
import {
  CREATE_GLOBAL_ROLE,
  RELATE_GLOBAL_ROLE_PERMISSIONS,
} from "../constants/queries";
import { sendResponse } from "../utils";
import {
  DEFAULT_SUCCES_API_RESPONSE,
  GLOBAL_PERMISSION_SUCCESSFULLY_CREATE_MESSAGE,
} from "../constants/messages";
import { HTTP_STATUS_CODE_CREATED } from "../constants/httpStatusCodes";

const globalRolesController = {
  createGlobalRole: async (req: Request, res: Response, next: NextFunction) => {
    const { roleName, permissions } = req.body;
    const db = await connectToDB();

    try {
      await db.query("BEGIN");

      const createRoleResult = await db.query(CREATE_GLOBAL_ROLE, [roleName]);
      const newRole = createRoleResult.rows[0];

      const relatePermissionsResult = await db.query(
        RELATE_GLOBAL_ROLE_PERMISSIONS,
        [newRole.id, permissions]
      );
      const newRolePermissions = relatePermissionsResult.rows.map(
        (p) => p.permission_id
      );

      await db.query("COMMIT");

      return sendResponse(
        {
          ...DEFAULT_SUCCES_API_RESPONSE,
          status: HTTP_STATUS_CODE_CREATED,
          message: GLOBAL_PERMISSION_SUCCESSFULLY_CREATE_MESSAGE,
          data: { ...newRole, permissions: newRolePermissions },
        },
        res
      );
    } catch (err) {
      console.log(err);

      await db.query("ROLLBACK");
      return next(err);
    }
  },
};

export default globalRolesController;
