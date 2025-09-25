import { NextFunction, Request, Response } from "express";
import connectToDB from "../db";
import {
  CREATE_PROJECT_ROLE,
  DELETE_PROJECT_ROLE_PERMISSIONS,
  GET_PROJECT_ROLE_PERMISSIONS_ID,
  RELATE_PROJECT_ROLE_PERMISSIONS,
  UPDATE_PROJECT_ROLE,
} from "../constants/queries";
import { sendResponse } from "../utils";
import {
  DEFAULT_SUCCES_API_RESPONSE,
  PROJECT_ROLE_SUCCESSFULLY_CREATED,
  PROJECT_ROLE_SUCCESSFULLY_UPDATED_MESSAGE,
} from "../constants/messages";
import {
  HTTP_STATUS_CODE_CREATED,
  HTTP_STATUS_CODE_NOT_FOUND,
} from "../constants/httpStatusCodes";
import { QueryResult } from "pg";

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
  updateProjectRole: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { roleID } = req.params;
    const { roleName, permissions } = req.body;
    const db = await connectToDB();

    try {
      await db.query("BEGIN");

      const updateRoleResult = await db.query(UPDATE_PROJECT_ROLE, [
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
        await db.query(DELETE_PROJECT_ROLE_PERMISSIONS, [roleID]);
        resultPermission = await db.query(RELATE_PROJECT_ROLE_PERMISSIONS, [
          roleID,
          permissions,
        ]);
      } else {
        resultPermission = await db.query(GET_PROJECT_ROLE_PERMISSIONS_ID, [
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
          message: PROJECT_ROLE_SUCCESSFULLY_UPDATED_MESSAGE,
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

export default projectRolesController;
