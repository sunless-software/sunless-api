import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import connectToDB from "../db";
import {
  CREATE_COLLABORATOR,
  CREATE_PROJECT,
  SOFT_DELETE_PROJECT,
} from "../constants/queries";
import {
  HTTP_STATUS_CODE_CREATED,
  HTTP_STATUS_CODE_NOT_FOUND,
} from "../constants/httpStatusCodes";
import { encryptText, sendResponse } from "../utils";
import {
  DEFAULT_SUCCES_API_RESPONSE,
  PROJECT_SUCCESSFULLY_CREATED_MESSAGE,
  PROJECT_SUCCESSFULLY_DELETED_MESSAGE,
} from "../constants/messages";
import { AuthRequest } from "../interfaces";

// TODO: Que pasa si al desencriptar la key esta mal
const projectsController = {
  createProject: async (req: Request, res: Response, next: NextFunction) => {
    const authID = (req as AuthRequest).user.id;
    let {
      name,
      description,
      status,
      publicProject,
      startDate,
      endDate,
      estimatedEnd,
    } = req.body;
    let encryptedProjectName: string = name;
    let encryptedProjectDescription: string = description;

    const db = await connectToDB();

    const nameHash = crypto.createHash("sha256").update(name).digest("hex");
    const projectKey = crypto.randomBytes(32).toString("base64");
    const encryptedProjectKey = encryptText(projectKey);

    if (!publicProject) {
      encryptedProjectName = encryptText(name, projectKey);
      encryptedProjectDescription = encryptText(description, projectKey);
    }

    try {
      await db.query("BEGIN");

      const createProject = await db.query(CREATE_PROJECT, [
        encryptedProjectName,
        nameHash,
        encryptedProjectDescription,
        status,
        publicProject,
        startDate,
        endDate,
        estimatedEnd,
        encryptedProjectKey,
        false,
      ]);
      const createdProject = createProject.rows[0];
      await db.query(CREATE_COLLABORATOR, [createdProject.id, authID, 1]);
      await db.query("COMMIT");

      return sendResponse(
        {
          ...DEFAULT_SUCCES_API_RESPONSE,
          status: HTTP_STATUS_CODE_CREATED,
          message: PROJECT_SUCCESSFULLY_CREATED_MESSAGE,
          data: [{ ...createdProject, name: name, description: description }],
        },
        res
      );
    } catch (err) {
      await db.query("ROLLBACK");
      return next(err);
    }
  },
  deleteProject: async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const db = await connectToDB();

    try {
      const result = await db.query(SOFT_DELETE_PROJECT, [id]);
      const affectedRows = result.rowCount;

      if (!affectedRows) {
        throw new Error(HTTP_STATUS_CODE_NOT_FOUND.toString());
      }

      return sendResponse(
        {
          ...DEFAULT_SUCCES_API_RESPONSE,
          message: PROJECT_SUCCESSFULLY_DELETED_MESSAGE,
        },
        res
      );
    } catch (err) {
      return next(err);
    }
  },
};

export default projectsController;
