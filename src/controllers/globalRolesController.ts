import { NextFunction, Request, Response } from "express";
import connectToDB from "../db";
import {
  CREATE_GLOBAL_ROLE,
  DELETE_GLOBAL_ROLE_PERMISSIONS,
  GET_GLOBAL_ROLE_PERMISSIONS_ID,
  RELATE_GLOBAL_ROLE_PERMISSIONS,
  UPDATE_GLOBAL_ROLE,
} from "../constants/queries";
import { sendResponse } from "../utils";
import {
  DEFAULT_SUCCES_API_RESPONSE,
  GLOBAL_ROLE_SUCCESSFULLY_CREATED_MESSAGE,
  GLOBAL_ROLE_SUCCESSFULLY_UPDATED_MESSAGE,
} from "../constants/messages";
import {
  HTTP_STATUS_CODE_CREATED,
  HTTP_STATUS_CODE_NOT_FOUND,
} from "../constants/httpStatusCodes";
import { QueryResult } from "pg";

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
          message: GLOBAL_ROLE_SUCCESSFULLY_CREATED_MESSAGE,
          data: { ...newRole, permissions: newRolePermissions },
        },
        res
      );
    } catch (err) {
      await db.query("ROLLBACK");
      return next(err);
    }
  },
  updateGlobalRole: async (req: Request, res: Response, next: NextFunction) => {
    const { roleID } = req.params;
    const { roleName, permissions } = req.body;
    const db = await connectToDB();

    try {
      await db.query("BEGIN");

      const updateRoleResult = await db.query(UPDATE_GLOBAL_ROLE, [
        roleName,
        roleID,
      ]);
      const affectedRows = updateRoleResult.rowCount;

      if (!affectedRows) {
        throw new Error(HTTP_STATUS_CODE_NOT_FOUND.toString());
      }

      const updatedRole = updateRoleResult.rows[0];
      let resultPermission: QueryResult<any>;

      if (permissions) {
        await db.query(DELETE_GLOBAL_ROLE_PERMISSIONS, [roleID]);
        resultPermission = await db.query(RELATE_GLOBAL_ROLE_PERMISSIONS, [
          roleID,
          permissions,
        ]);
      } else {
        resultPermission = await db.query(GET_GLOBAL_ROLE_PERMISSIONS_ID, [
          roleID,
        ]);
      }

      const updatedRolePermissions = resultPermission.rows.map(
        (p) => p.permission_id
      );

      await db.query("COMMIT");

      return sendResponse(
        {
          ...DEFAULT_SUCCES_API_RESPONSE,
          message: GLOBAL_ROLE_SUCCESSFULLY_UPDATED_MESSAGE,
          data: { ...updatedRole, permissions: updatedRolePermissions },
        },
        res
      );
    } catch (err) {
      await db.query("ROLLBACK");
      return next(err);
    }
  },
};

export default globalRolesController;
