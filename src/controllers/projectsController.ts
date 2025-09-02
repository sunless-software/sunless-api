import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import connectToDB from "../db";
import {
  ADD_PROJECT_TAG,
  CHECK_PROJECT_EXISTS,
  CHECK_PROJECT_ROLE_EXISTS,
  CHECK_VALID_USER_EXISTS,
  COUNT_PROJECTS_FROM_USER,
  CREATE_COLLABORATOR,
  CREATE_PROJECT,
  GET_PROJECT_KEY,
  GET_PROJECTS_BY_USER,
  SOFT_DELETE_PROJECT,
  UPDATE_PROJECT,
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
  PROJECT_SUCCESSFULLY_CREATED_MESSAGE,
  PROJECT_SUCCESSFULLY_DELETED_MESSAGE,
  PROJECT_SUCCESSFULLY_UPDATED,
  PROJECTS_SUCCESSFULLY_RETRIVED,
} from "../constants/messages";
import { AuthRequest, ProjectInvitation } from "../interfaces";
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
    const db = await connectToDB();

    const nameHash = crypto.createHash("sha256").update(name).digest("hex");
    const projectKey = crypto.randomBytes(32).toString("base64");
    const encryptedProjectKey = encryptText(projectKey);

    const encryptedProjectName = encryptText(name, projectKey);
    const encryptedProjectDescription =
      description && encryptText(description, projectKey);

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
      const getProjectEncryptedKeyResult = await db.query(GET_PROJECT_KEY, [
        id,
      ]);

      if (!getProjectEncryptedKeyResult.rowCount) {
        throw new Error(HTTP_STATUS_CODE_NOT_FOUND.toString());
      }

      const encryptedProjectKey = getProjectEncryptedKeyResult.rows[0].key;
      const decryptedProjectKey = decryptText(encryptedProjectKey);

      const nameHash =
        name && crypto.createHash("sha256").update(name).digest("hex");
      name = name ? encryptText(name, decryptedProjectKey) : name;
      description = description
        ? encryptText(description, decryptedProjectKey)
        : description;

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

      const resultProjectData = result.rows[0];

      return sendResponse(
        {
          ...DEFAULT_SUCCES_API_RESPONSE,
          message: PROJECT_SUCCESSFULLY_UPDATED,
          data: [
            {
              ...resultProjectData,
              name: resultProjectData.name
                ? decryptText(resultProjectData.name, decryptedProjectKey)
                : resultProjectData.name,
              description: resultProjectData.description
                ? decryptText(
                    resultProjectData.description,
                    decryptedProjectKey
                  )
                : resultProjectData.description,
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
  getProjectFromUser: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { userID } = req.params;
    const {
      offset = 0,
      limit = 20,
      showPrivateProjects = false,
      tags,
    } = req.query;

    const authID = (req as AuthRequest).user.id;
    const db = await connectToDB();

    try {
      const [resultProjects, resultCount] = await Promise.all([
        db.query(GET_PROJECTS_BY_USER, [
          userID,
          authID,
          showPrivateProjects,
          offset,
          limit,
          tags ? (tags as string).split(",") : tags,
        ]),
        db.query(COUNT_PROJECTS_FROM_USER, [userID]),
      ]);

      const projects = resultProjects.rows.map((project) => {
        const { is_collaborator, deleted, ...cleanProject } = project;

        if (project.public || project.is_collaborator) {
          const decryptedProjectKey = decryptText(project.key);

          return {
            ...cleanProject,
            name: decryptText(project.name, decryptedProjectKey),
            description: decryptText(project.description, decryptedProjectKey),
            key: "****",
          };
        }

        return {
          ...cleanProject,
          key: "****",
        };
      });

      return sendResponse(
        {
          ...DEFAULT_SUCCES_API_RESPONSE,
          message: PROJECTS_SUCCESSFULLY_RETRIVED,
          data: projects,
          pagination: {
            offset:
              typeof offset === "string"
                ? parseInt(offset)
                : (offset as number),
            limit:
              typeof limit === "string" ? parseInt(limit) : (limit as number),
            count: projects.length,
            total: parseInt(resultCount.rows[0].total),
          },
        },
        res
      );
    } catch (err) {
      return next(err);
    }
  },
};

export default projectsController;
