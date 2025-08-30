import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import connectToDB from "../db";
import {
  CREATE_PROJECT_EXTERNAL_RESOURCE,
  ADD_PROJECT_TAG,
  CHECK_PROJECT_EXISTS,
  CHECK_PROJECT_ROLE_EXISTS,
  CHECK_VALID_USER_EXISTS,
  CREATE_COLLABORATOR,
  CREATE_PROJECT,
  GET_PROJECT_ENCRYPTED_FIELDS,
  GET_PROJECT_KEY,
  REMOVE_PROJECT_TAG,
  SOFT_DELETE_PROJECT,
  UPDATE_PROJECT,
  DELETE_PROJECT_EXTERNAL_RESOURCE,
} from "../constants/queries";
import {
  HTTP_STATUS_CODE_CREATED,
  HTTP_STATUS_CODE_NOT_FOUND,
} from "../constants/httpStatusCodes";
import { decryptText, encryptText, sendResponse, signJWT } from "../utils";
import {
  COLLABORATOR_SUCCESSFULLY_ADDED,
  DEFAULT_SUCCES_API_RESPONSE,
  INVITATION_SUCCESSFULLY_CREATED,
  PROJECT_EXTERNAL_RESOURCE_SUCCESSFULLY_ADDED,
  PROJECT_EXTERNAL_RESOURCE_SUCCESSFULLY_DELETED,
  PROJECT_SUCCESSFULLY_CREATED_MESSAGE,
  PROJECT_SUCCESSFULLY_DELETED_MESSAGE,
  PROJECT_SUCCESSFULLY_UPDATED,
  TAG_SUCCESSFULLY_ADDED,
  TAG_SUCCESSFULLY_REMOVED,
} from "../constants/messages";
import { AuthRequest, ProjectInvitation, UserCredentials } from "../interfaces";
import { PROJECT_INVITATION_LIFE_TIME } from "../constants/setup";
import jwt from "jsonwebtoken";
import { INCORRECT_USER_INVITATION } from "../constants/managedErrors";

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
  // TODO: When implement AWS SAS send a mail to the invited user with the jwt
  createProjectInvitation: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const projectID = req.params.id;
    const { userID, projectRoleID } = req.body;
    const secret = process.env.SECRET;
    const db = await connectToDB();

    try {
      const result = await Promise.all([
        db.query(CHECK_VALID_USER_EXISTS, [userID]),
        db.query(CHECK_PROJECT_EXISTS, [projectID]),
        db.query(CHECK_PROJECT_ROLE_EXISTS, [projectRoleID]),
      ]);
      const allEntitiesExists = result.every((r) => r.rows[0].count === "1");

      if (!allEntitiesExists) {
        throw new Error(HTTP_STATUS_CODE_NOT_FOUND.toString());
      }

      const payload = {
        userID: userID,
        projectID: parseInt(projectID),
        projectRoleID: projectRoleID,
      };

      const token = signJWT(
        payload,
        secret as string,
        PROJECT_INVITATION_LIFE_TIME
      );

      return sendResponse(
        {
          ...DEFAULT_SUCCES_API_RESPONSE,
          status: HTTP_STATUS_CODE_CREATED,
          message: INVITATION_SUCCESSFULLY_CREATED,
          data: [token],
        },
        res
      );
    } catch (err) {
      return next(err);
    }
  },
  acceptProjectInvitation: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const secret = process.env.SECRET;
    const authID = (req as AuthRequest).user.id;
    const invitationJwt = req.body.code;
    const db = await connectToDB();

    try {
      const decodedPayload = jwt.verify(
        invitationJwt,
        secret as string
      ) as ProjectInvitation;

      if (authID !== decodedPayload.userID) {
        throw new Error(INCORRECT_USER_INVITATION);
      }

      const result = await db.query(CREATE_COLLABORATOR, [
        decodedPayload.projectID,
        decodedPayload.userID,
        decodedPayload.projectRoleID,
      ]);
      const affectedRows = result.rowCount;

      if (!affectedRows) {
        throw new Error(HTTP_STATUS_CODE_NOT_FOUND.toString());
      }

      sendResponse(
        {
          ...DEFAULT_SUCCES_API_RESPONSE,
          status: HTTP_STATUS_CODE_CREATED,
          message: COLLABORATOR_SUCCESSFULLY_ADDED,
        },
        res
      );
    } catch (err) {
      return next(err);
    }
  },
  addProjectTag: async (req: Request, res: Response, next: NextFunction) => {
    const projectID = req.params.id;
    const { tagID } = req.body;

    const db = await connectToDB();

    try {
      const result = await db.query(ADD_PROJECT_TAG, [projectID, tagID]);
      const affectedRows = result.rowCount;

      if (!affectedRows) {
        throw new Error(HTTP_STATUS_CODE_NOT_FOUND.toString());
      }

      return sendResponse(
        {
          ...DEFAULT_SUCCES_API_RESPONSE,
          status: HTTP_STATUS_CODE_CREATED,
          message: TAG_SUCCESSFULLY_ADDED,
          data: result.rows,
        },
        res
      );
    } catch (err) {
      return next(err);
    }
  },
  removeProjectTag: async (req: Request, res: Response, next: NextFunction) => {
    const { projectID, tagID } = req.params;

    const db = await connectToDB();

    try {
      const result = await db.query(REMOVE_PROJECT_TAG, [projectID, tagID]);
      const affectedRows = result.rowCount;

      if (!affectedRows) {
        throw new Error(HTTP_STATUS_CODE_NOT_FOUND.toString());
      }

      return sendResponse(
        { ...DEFAULT_SUCCES_API_RESPONSE, message: TAG_SUCCESSFULLY_REMOVED },
        res
      );
    } catch (err) {
      return next(err);
    }
  },
  addExternalResource: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { projectID } = req.params;
    const { name, url, type } = req.body;
    const urlHash = crypto.createHash("sha256").update(url).digest("hex");
    const db = await connectToDB();

    try {
      const resultProjectKey = await db.query(GET_PROJECT_KEY, [projectID]);

      if (!resultProjectKey.rowCount) {
        throw new Error(HTTP_STATUS_CODE_NOT_FOUND.toString());
      }

      const projectKey = resultProjectKey.rows[0].key;
      const decryptedProjectKey = decryptText(projectKey);
      const encryptedUrl = encryptText(url, decryptedProjectKey);

      const result = await db.query(CREATE_PROJECT_EXTERNAL_RESOURCE, [
        projectID,
        name,
        encryptedUrl,
        urlHash,
        type,
      ]);
      const affectedRows = result.rowCount;

      if (!affectedRows) {
        throw new Error(HTTP_STATUS_CODE_NOT_FOUND.toString());
      }

      return sendResponse(
        {
          ...DEFAULT_SUCCES_API_RESPONSE,
          status: HTTP_STATUS_CODE_CREATED,
          message: PROJECT_EXTERNAL_RESOURCE_SUCCESSFULLY_ADDED,
          data: [{ ...result.rows[0], url: url }],
        },
        res
      );
    } catch (err) {
      return next(err);
    }
  },
  deleteProjectExternalResource: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { projectID, resourceID } = req.params;
    const db = await connectToDB();

    try {
      const result = await db.query(DELETE_PROJECT_EXTERNAL_RESOURCE, [
        projectID,
        resourceID,
      ]);
      const affectedRows = result.rowCount;

      if (!affectedRows) {
        throw new Error(HTTP_STATUS_CODE_NOT_FOUND.toString());
      }

      return sendResponse(
        {
          ...DEFAULT_SUCCES_API_RESPONSE,
          message: PROJECT_EXTERNAL_RESOURCE_SUCCESSFULLY_DELETED,
        },
        res
      );
    } catch (err) {
      return next(err);
    }
  },
};

export default projectsController;
