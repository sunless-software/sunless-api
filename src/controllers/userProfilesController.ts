import { NextFunction, Request, Response } from "express";
import connectToDB from "../db";
import { UPDATE_USER_PROFILE } from "../constants/queries";
import { HTTP_STATUS_CODE_NOT_FOUND } from "../constants/httpStatusCodes";
import { sendResponse } from "../utils";
import {
  DEFAULT_SUCCES_API_RESPONSE,
  USER_PROFILE_SUCCESSFULLY_UPDATED,
} from "../constants/messages";

const userProfilesController = {
  updateUserProfile: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { userID } = req.params;
    const {
      longDescriptionUS,
      longDescriptionES,
      repoUrl,
      websiteUrl,
      linkedinUrl,
      locationUS,
      locationES,
    } = req.body;
    const db = await connectToDB();

    try {
      const result = await db.query(UPDATE_USER_PROFILE, [
        longDescriptionUS,
        longDescriptionES,
        repoUrl,
        websiteUrl,
        linkedinUrl,
        locationUS,
        locationES,
        userID,
      ]);
      const affectedRows = result.rowCount;

      if (!affectedRows) {
        throw new Error(HTTP_STATUS_CODE_NOT_FOUND.toString());
      }

      sendResponse(
        {
          ...DEFAULT_SUCCES_API_RESPONSE,
          message: USER_PROFILE_SUCCESSFULLY_UPDATED,
          data: result.rows,
        },
        res
      );
    } catch (err) {
      return next(err);
    }
  },
};

export default userProfilesController;
