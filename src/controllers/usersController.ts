import { NextFunction, Request, Response } from "express";
import connectToDB from "../db";
import { CREATE_USER, GET_USERS } from "../constants/queries";
import { encryptPassword, sendResponse } from "../utils";
import {
  DEFAULT_SUCCES_API_RESPONSE,
  USER_SUCCESSFUL_CREATION_MESSAGE,
  USERS_SUCCESSFULLY_RETRIEVED_MESSAGE,
} from "../constants/messages";
import {
  ERROR_TYPE_CREATE_USER,
  ERROR_TYPE_GET_USERS,
  HTTP_STATUS_CODE_CREATED,
  PERMISSIONS,
} from "../constants/constants";
import { CustomError, User } from "../interfaces";
import { GET_USERS_DEFAULT_LIMIT } from "../constants/setup";

const usersController = {
  getUsers: async (req: Request, res: Response, next: NextFunction) => {
    const {
      offset = 0,
      limit = GET_USERS_DEFAULT_LIMIT,
      showPrivateUsers = false,
    } = req.body;

    const db = await connectToDB();
    const whereClause = !showPrivateUsers ? `WHERE public = true` : "";
    const query = GET_USERS.replace(`_1`, whereClause);

    try {
      const result = await db.query(query, [offset, limit]);
      const users: Array<User> = result.rows.map((user: User) => ({
        ...user,
        password: "****",
      }));

      return sendResponse(
        {
          ...DEFAULT_SUCCES_API_RESPONSE,
          message: USERS_SUCCESSFULLY_RETRIEVED_MESSAGE,
          data: [users],
        },
        res
      );
    } catch (err) {
      const customError: CustomError = {
        errorType: ERROR_TYPE_GET_USERS,
        error: err,
      };

      return next(customError);
    }
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
