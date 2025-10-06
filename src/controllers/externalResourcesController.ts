import { NextFunction, Request, Response } from "express";
import crypto from "crypto";
import connectToDB from "../db";
import {
  CREATE_PROJECT_EXTERNAL_RESOURCE,
  DELETE_PROJECT_EXTERNAL_RESOURCE,
  GET_PROJECT_KEY,
  UPDATE_PROJECT_EXTERNAL_RESOURCE,
} from "../constants/queries";
import {
  HTTP_STATUS_CODE_CREATED,
  HTTP_STATUS_CODE_NOT_FOUND,
} from "../constants/httpStatusCodes";
import { decryptText, encryptText, sendResponse } from "../utils";
import {
  DEFAULT_SUCCES_API_RESPONSE,
  PROJECT_EXTERNAL_RESOURCE_SUCCESSFULLY_ADDED,
  PROJECT_EXTERNAL_RESOURCE_SUCCESSFULLY_DELETED,
  PROJECT_EXTERNAL_RESOURCE_SUCCESSFULLY_PATCHED,
} from "../constants/messages";

const externalResourcesController = {
  createExternalResource: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { projectID } = req.params;
    const { nameUS, nameES, url, type } = req.body;
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
        nameUS,
        nameES,
        encryptedUrl,
        urlHash,
        type,
      ]);
      const affectedRows = result.rowCount;

      if (!affectedRows) {
        throw new Error(HTTP_STATUS_CODE_NOT_FOUND.toString());
      }

      const externalResourceData = result.rows[0];
      const { url_hash, ...cleanExternalResource } = externalResourceData;

      return sendResponse(
        {
          ...DEFAULT_SUCCES_API_RESPONSE,
          status: HTTP_STATUS_CODE_CREATED,
          message: PROJECT_EXTERNAL_RESOURCE_SUCCESSFULLY_ADDED,
          data: [{ ...cleanExternalResource, url: url }],
        },
        res
      );
    } catch (err) {
      return next(err);
    }
  },
  updateExternalResource: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { projectID, resourceID } = req.params;
    let { name, url, type } = req.body;
    const db = await connectToDB();

    try {
      const resultGetProjectKey = await db.query(GET_PROJECT_KEY, [projectID]);

      if (!resultGetProjectKey.rowCount) {
        throw new Error(HTTP_STATUS_CODE_NOT_FOUND.toString());
      }

      const encryptedProjectKey = resultGetProjectKey.rows[0].key;
      const decryptedProjectKey = decryptText(encryptedProjectKey);

      const encryptedUrl = url && encryptText(url, decryptedProjectKey);
      const urlHash =
        url && crypto.createHash("sha256").update(url).digest("hex");

      const result = await db.query(UPDATE_PROJECT_EXTERNAL_RESOURCE, [
        projectID,
        resourceID,
        name,
        encryptedUrl,
        urlHash,
        type,
      ]);

      const affectedRows = result.rowCount;
      if (!affectedRows) {
        throw new Error(HTTP_STATUS_CODE_NOT_FOUND.toString());
      }

      const externalResourceData = result.rows[0];
      const { url_hash, ...cleanExternalResource } = externalResourceData;

      return sendResponse(
        {
          ...DEFAULT_SUCCES_API_RESPONSE,
          message: PROJECT_EXTERNAL_RESOURCE_SUCCESSFULLY_PATCHED,
          data: [
            {
              ...cleanExternalResource,
              url: url || decryptText(result.rows[0].url, decryptedProjectKey),
            },
          ],
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

export default externalResourcesController;
