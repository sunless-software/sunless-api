import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import connectToDB from "../db";
import {
  CHECK_PROJECT_EXISTS,
  CHECK_PROJECT_ROLE_EXISTS,
  CHECK_VALID_USER_EXISTS,
  COUNT_ALL_PROJECTS,
  COUNT_PROJECTS_FROM_USER,
  CREATE_COLLABORATOR,
  CREATE_PROJECT,
  GET_ALL_PROJECTS,
  GET_PROJECT_DETAILS,
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
  PROJECT_DETAILS_SUCCESSFULLY_RETRIEVED,
  PROJECT_SUCCESSFULLY_CREATED_MESSAGE,
  PROJECT_SUCCESSFULLY_DELETED_MESSAGE,
  PROJECT_SUCCESSFULLY_UPDATED,
  PROJECTS_SUCCESSFULLY_RETRIEVED,
} from "../constants/messages";
import {
  AuthRequest,
  ProjectCollaborator,
  ProjectExternalResource,
  ProjectInvitation,
  ProjectMedia,
} from "../interfaces";
import { PROJECT_INVITATION_LIFE_TIME } from "../constants/setup";
import jwt from "jsonwebtoken";
import { INCORRECT_USER_INVITATION } from "../constants/managedErrors";

const projectsController = {
  createProject: async (req: Request, res: Response, next: NextFunction) => {
    const authID = (req as AuthRequest).user.id;
    let {
      name,
      shortDescription,
      longDescription,
      logo,
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
    const encryptedProjectShortDescription =
      shortDescription && encryptText(shortDescription, projectKey);
    const encryptedProjectLongDescription =
      longDescription && encryptText(longDescription, projectKey);

    try {
      await db.query("BEGIN");

      const createProject = await db.query(CREATE_PROJECT, [
        encryptedProjectName,
        nameHash,
        encryptedProjectShortDescription,
        encryptedProjectLongDescription,
        logo,
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
            {
              ...createdProject,
              name: name,
              short_description: shortDescription || "",
              long_description: longDescription || "",
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
  updateProject: async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    let {
      name,
      shortDescription,
      longDescription,
      logo,
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
      shortDescription = shortDescription
        ? encryptText(shortDescription, decryptedProjectKey)
        : shortDescription;
      longDescription = longDescription
        ? encryptText(longDescription, decryptedProjectKey)
        : longDescription;

      const result = await db.query(UPDATE_PROJECT, [
        name,
        nameHash,
        shortDescription,
        longDescription,
        logo,
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
              short_description: resultProjectData.short_description
                ? decryptText(
                    resultProjectData.short_description,
                    decryptedProjectKey
                  )
                : resultProjectData.short_description,
              long_description: resultProjectData.long_description
                ? decryptText(
                    resultProjectData.long_description,
                    decryptedProjectKey
                  )
                : resultProjectData.long_description,
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
  getProjects: async (req: Request, res: Response, next: NextFunction) => {
    const { userID } = req.params;
    const {
      offset = 0,
      limit = 20,
      showPrivateProjects = false,
      tags,
    } = req.query;

    const authID = (req as AuthRequest).user.id;
    const db = await connectToDB();
    const projectsQuery = userID ? GET_PROJECTS_BY_USER : GET_ALL_PROJECTS;
    const countQuery = userID ? COUNT_PROJECTS_FROM_USER : COUNT_ALL_PROJECTS;
    let queryParams = [
      userID,
      authID,
      showPrivateProjects,
      offset,
      limit,
      tags ? (tags as string).split(",") : tags,
    ];
    queryParams = userID ? queryParams : queryParams.slice(1);

    try {
      const [resultProjects, resultCount] = await Promise.all([
        db.query(projectsQuery, queryParams),
        db.query(countQuery, userID ? [userID] : []),
      ]);

      const projects = resultProjects.rows.map((project) => {
        const { name_hash, key, is_collaborator, deleted, ...cleanProject } =
          project;

        if (project.public || project.is_collaborator) {
          const decryptedProjectKey = decryptText(project.key);

          return {
            ...cleanProject,
            name: decryptText(project.name, decryptedProjectKey),
            short_description: decryptText(
              project.short_description,
              decryptedProjectKey
            ),
            long_description: decryptText(
              project.long_description,
              decryptedProjectKey
            ),
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
          message: PROJECTS_SUCCESSFULLY_RETRIEVED,
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
  getProjectDetails: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { projectID } = req.params;
    const authID = (req as AuthRequest).user.id;
    const db = await connectToDB();

    try {
      const result = await db.query(GET_PROJECT_DETAILS, [projectID]);
      const affectedRows = result.rowCount;

      if (!affectedRows) {
        throw new Error(HTTP_STATUS_CODE_NOT_FOUND.toString());
      }

      const projectData = result.rows[0];
      const collaborators: Array<ProjectCollaborator> =
        projectData.collaborators;
      const isCollaborator = collaborators.some(
        (collaborator) => collaborator.id === authID
      );

      if (isCollaborator || projectData.public) {
        const encryptedProjectKey = projectData.key;
        const decryptedProjectKey = decryptText(encryptedProjectKey);

        projectData.name = decryptText(projectData.name, decryptedProjectKey);
        projectData.short_description = decryptText(
          projectData.short_description,
          decryptedProjectKey
        );
        projectData.long_description = decryptText(
          projectData.long_description,
          decryptedProjectKey
        );

        projectData.external_resources = projectData.external_resources.map(
          (externalResource: ProjectExternalResource) => {
            return {
              ...externalResource,
              url: decryptText(externalResource.url, decryptedProjectKey),
            };
          }
        );

        projectData.media = projectData.media.map((media: ProjectMedia) => {
          return { ...media, url: decryptText(media.url, decryptedProjectKey) };
        });
      }

      const { name_hash, key, deleted, ...cleanProject } = projectData;

      sendResponse(
        {
          ...DEFAULT_SUCCES_API_RESPONSE,
          message: PROJECT_DETAILS_SUCCESSFULLY_RETRIEVED,
          data: [{ ...cleanProject, key: "****" }],
        },
        res
      );
    } catch (err) {
      return next(err);
    }
  },
};

export default projectsController;
