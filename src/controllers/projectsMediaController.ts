import { NextFunction, Request, Response } from "express";
import crypto from "crypto";
import connectToDB from "../db";
import {
  CREATE_PROJECT_MEDIA,
  DELETE_PROJECT_MEDIA,
  GET_PROJECT_KEY,
  UPDATE_PROJECT_MEDIA,
} from "../constants/queries";
import {
  HTTP_STATUS_CODE_CREATED,
  HTTP_STATUS_CODE_NOT_FOUND,
} from "../constants/httpStatusCodes";
import { decryptText, encryptText, sendResponse } from "../utils";
import {
  DEFAULT_SUCCES_API_RESPONSE,
  PROJECT_MEDIA_SUCCESSFULLY_CREATED,
  PROJECT_MEDIA_SUCCESSFULLY_DELETED,
  PROJECT_MEDIA_SUCCESSFULLY_UPDATED,
} from "../constants/messages";

const projectsMediaController = {
  createProjectMedia: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { url, type } = req.body;
    const { projectID } = req.params;
    const db = await connectToDB();
    const urlHash = crypto.createHash("sha256").update(url).digest("hex");

    try {
      const resultProjectKey = await db.query(GET_PROJECT_KEY, [projectID]);

      if (!resultProjectKey.rowCount) {
        throw new Error(HTTP_STATUS_CODE_NOT_FOUND.toString());
      }

      const encryptedProjectKey = resultProjectKey.rows[0].key;
      const decryptedProjectKey = decryptText(encryptedProjectKey);
      const encryptedUrl = encryptText(url, decryptedProjectKey);

      const result = await db.query(CREATE_PROJECT_MEDIA, [
        projectID,
        encryptedUrl,
        urlHash,
        type,
      ]);
      const affectedRows = result.rowCount;

      if (!affectedRows) {
        throw new Error(HTTP_STATUS_CODE_NOT_FOUND.toString());
      }

      const { url_hash, ...cleanResult } = result.rows[0];

      return sendResponse(
        {
          ...DEFAULT_SUCCES_API_RESPONSE,
          status: HTTP_STATUS_CODE_CREATED,
          message: PROJECT_MEDIA_SUCCESSFULLY_CREATED,
          data: [{ ...cleanResult, url: url }],
        },
        res
      );
    } catch (err) {
      return next(err);
    }
  },
  updateProjectMedia: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    let { url, type } = req.body;
    const { projectID, mediaID } = req.params;
    const db = await connectToDB();

    try {
      const getProjectKeyResult = await db.query(GET_PROJECT_KEY, [projectID]);

      if (!getProjectKeyResult.rowCount) {
        throw new Error(HTTP_STATUS_CODE_NOT_FOUND.toString());
      }

      const encryptedProjectKey = getProjectKeyResult.rows[0].key;
      const decryptedProjectKey = decryptText(encryptedProjectKey);
      const urlHash =
        url && crypto.createHash("sha256").update(url).digest("hex");
      url = url ? encryptText(url, decryptedProjectKey) : url;

      const result = await db.query(UPDATE_PROJECT_MEDIA, [
        url,
        urlHash,
        type,
        mediaID,
        projectID,
      ]);
      const affectedRows = result.rowCount;

      if (!affectedRows) {
        throw new Error(HTTP_STATUS_CODE_NOT_FOUND.toString());
      }

      const { url_hash, ...cleanResult } = result.rows[0];

      return sendResponse(
        {
          ...DEFAULT_SUCCES_API_RESPONSE,
          message: PROJECT_MEDIA_SUCCESSFULLY_UPDATED,
          data: [
            {
              ...cleanResult,
              url: decryptText(cleanResult.url, decryptedProjectKey),
            },
          ],
        },
        res
      );
    } catch (err) {
      return next(err);
    }
  },
  deleteProjectMedia: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { projectID, mediaID } = req.params;
    const db = await connectToDB();

    try {
      const result = await db.query(DELETE_PROJECT_MEDIA, [projectID, mediaID]);
      const affectedRows = result.rowCount;

      if (!affectedRows) {
        throw new Error(HTTP_STATUS_CODE_NOT_FOUND.toString());
      }

      return sendResponse(
        {
          ...DEFAULT_SUCCES_API_RESPONSE,
          message: PROJECT_MEDIA_SUCCESSFULLY_DELETED,
        },
        res
      );
    } catch (err) {
      return next(err);
    }
  },
};

export default projectsMediaController;
