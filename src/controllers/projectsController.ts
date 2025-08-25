import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import connectToDB from "../db";
import { CREATE_PROJECT } from "../constants/queries";
import { HTTP_STATUS_CODE_CREATED } from "../constants/httpStatusCodes";
import { encryptText, sendResponse } from "../utils";
import {
  DEFAULT_SUCCES_API_RESPONSE,
  PROJECT_SUCCESSFULLY_CREATED_MESSAGE,
} from "../constants/messages";

// TODO: Que pasa si al desencriptar la key esta mal
const projectsController = {
  createProject: async (req: Request, res: Response, next: NextFunction) => {
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

    const projectKey = crypto.randomBytes(32).toString("base64");
    const encryptedProjectKey = encryptText(projectKey);

    if (!publicProject) {
      encryptedProjectName = encryptText(name, projectKey);
      encryptedProjectDescription = encryptText(description, projectKey);
    }

    try {
      const result = await db.query(CREATE_PROJECT, [
        encryptedProjectName,
        encryptedProjectDescription,
        status,
        publicProject,
        startDate,
        endDate,
        estimatedEnd,
        encryptedProjectKey,
        false,
      ]);

      return sendResponse(
        {
          ...DEFAULT_SUCCES_API_RESPONSE,
          status: HTTP_STATUS_CODE_CREATED,
          message: PROJECT_SUCCESSFULLY_CREATED_MESSAGE,
          data: [{ ...result.rows[0], name: name, description: description }],
        },
        res
      );
    } catch (err) {
      return next(err);
    }
  },
};

export default projectsController;
