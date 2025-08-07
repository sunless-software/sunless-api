import { NextFunction, Request, Response } from "express";
import connectToDB from "../db";
import { CREATE_USER } from "../constants/queries";
import { encryptPassword, sendResponse } from "../utils";
import {
  DEFAULT_SUCCES_API_RESPONSE,
  USER_SUCCESSFUL_CREATION_MESSAGE,
} from "../constants/messages";
import {
  ERROR_TYPE_CREATE_USER,
  HTTP_STATUS_CODE_CREATED,
} from "../constants/constants";
import { CustomError } from "../interfaces";

const usersController = {
  getUsers: async (req: Request, res: Response) => {
    res.send("ola");
  },
  createUsers: async (req: Request, res: Response, next: NextFunction) => {
    const {
      username,
      password,
      roleID,
      profilePhoto,
      phone,
      email,
      publicProfile,
    } = req.body;

    const db = await connectToDB();
    const hashedPassword = await encryptPassword(password);

    try {
      const result = await db.query(CREATE_USER, [
        roleID,
        username,
        hashedPassword,
        profilePhoto,
        phone,
        email,
        publicProfile,
        false,
        false,
      ]);
      const createdUserData = result.rows[0];

      return sendResponse(
        {
          ...DEFAULT_SUCCES_API_RESPONSE,
          status: HTTP_STATUS_CODE_CREATED,
          message: USER_SUCCESSFUL_CREATION_MESSAGE,
          data: [{ ...createdUserData, password: "****" }],
        },
        res
      );
    } catch (err) {
      const customError: CustomError = {
        errorType: ERROR_TYPE_CREATE_USER,
        error: err,
      };

      return next(customError);
    }
  },
};

export default usersController;
