import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import connectToDB from "../db";
import {
  CREATE_COLLABORATOR,
  CREATE_PROJECT,
  GET_PROJECT_ENCRYPTED_FIELDS,
  SOFT_DELETE_PROJECT,
  UPDATE_PROJECT,
} from "../constants/queries";
import {
  HTTP_STATUS_CODE_CREATED,
  HTTP_STATUS_CODE_NOT_FOUND,
} from "../constants/httpStatusCodes";
import { decryptText, encryptText, sendResponse } from "../utils";
import {
  DEFAULT_SUCCES_API_RESPONSE,
  PROJECT_SUCCESSFULLY_CREATED_MESSAGE,
  PROJECT_SUCCESSFULLY_DELETED_MESSAGE,
  PROJECT_SUCCESSFULLY_UPDATED,
} from "../constants/messages";
import { AuthRequest } from "../interfaces";

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
    let encryptedProjectDescription: string | null = description;

    const db = await connectToDB();

    const nameHash = crypto.createHash("sha256").update(name).digest("hex");
    const projectKey = crypto.randomBytes(32).toString("base64");
    const encryptedProjectKey = encryptText(projectKey);

    if (!publicProject) {
      encryptedProjectName = encryptText(name, projectKey);
      encryptedProjectDescription = description
        ? encryptText(description, projectKey)
        : null;
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
          data: [
            { ...createdProject, name: name, description: description || "" },
          ],
        },
        res
      );
    } catch (err) {
      await db.query("ROLLBACK");
      return next(err);
    }
  },
  updateProject: async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    let {
      name,
      description,
      status,
      publicProject,
      startDate,
      endDate,
      estimatedEnd,
    } = req.body;
    const db = await connectToDB();

    try {
      await db.query("BEGIN");

      const getProjectEncryptedResult = await db.query(
        GET_PROJECT_ENCRYPTED_FIELDS,
        [id]
      );

      if (!getProjectEncryptedResult.rowCount) {
        throw new Error(HTTP_STATUS_CODE_NOT_FOUND.toString());
      }

      const encryptedProjectKey = getProjectEncryptedResult.rows[0].key;
      const decryptedProjectKey = decryptText(encryptedProjectKey);
      const previousPublicProject = getProjectEncryptedResult.rows[0].public;
      let plainNameFromDB: string = getProjectEncryptedResult.rows[0].name;
      let plainDescriptionFromDB: string =
        getProjectEncryptedResult.rows[0].description;

      if (!previousPublicProject) {
        plainNameFromDB = decryptText(plainNameFromDB, decryptedProjectKey);
        plainDescriptionFromDB = decryptText(
          plainDescriptionFromDB,
          decryptedProjectKey
        );
      }

      name = name ?? plainNameFromDB;
      description = description ?? plainDescriptionFromDB;

      const originalName = name;
      const originalDescription = description;
      const nameHash = crypto.createHash("sha256").update(name).digest("hex");

      if (
        publicProject === false ||
        (publicProject === undefined && previousPublicProject === false)
      ) {
        name = encryptText(name, decryptedProjectKey);
        description = encryptText(description, decryptedProjectKey);
      }

      const result = await db.query(UPDATE_PROJECT, [
        name,
        nameHash,
        description,
        status,
        publicProject,
        startDate,
        endDate,
        estimatedEnd,
        id,
      ]);

      await db.query("COMMIT");

      return sendResponse(
        {
          ...DEFAULT_SUCCES_API_RESPONSE,
          message: PROJECT_SUCCESSFULLY_UPDATED,
          data: [
            {
              ...result.rows[0],
              name: originalName,
              description: originalDescription,
            },
          ],
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
