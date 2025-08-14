import { NextFunction, Request, Response } from "express";
import connectToDB from "../db";
import { CREATE_USER, GET_USERS, SOFT_DELETE_USER } from "../constants/queries";
import { encryptPassword, sendResponse } from "../utils";
import {
  DEFAULT_SUCCES_API_RESPONSE,
  USER_SUCCESSFUL_CREATION_MESSAGE,
  USER_SUCCESSFULLY_DELETED_MESSAGE,
  USERS_SUCCESSFULLY_RETRIEVED_MESSAGE,
} from "../constants/messages";
import {
  HTTP_STATUS_CODE_CREATED,
  HTTP_STATUS_CODE_NOT_FOUND,
} from "../constants/httpStatusCodes";
import {
  ERROR_TYPE_CREATE_USER,
  ERROR_TYPE_DELETE_USER,
  ERROR_TYPE_GET_USERS,
} from "../constants/customErrors";
import { CustomError, User } from "../interfaces";
import { GET_USERS_DEFAULT_LIMIT } from "../constants/setup";

const usersController = {
  getUsers: async (req: Request, res: Response, next: NextFunction) => {
    const {
      offset = 0,
      limit = GET_USERS_DEFAULT_LIMIT,
      showPrivateUsers = false,
      showBannedUsers = false,
      showDeletedUsers = false,
    } = req.query;

    const db = await connectToDB();

    const conditions = [
      ...(!showPrivateUsers ? ["public = true"] : []),
      ...(!showBannedUsers ? ["banned = false"] : []),
      ...(!showDeletedUsers ? ["deleted = false"] : []),
    ];
    const whereClause = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";
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
  deleteUser: async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const db = await connectToDB();

    try {
      const response = await db.query(SOFT_DELETE_USER, [id]);
      const affectedRows = response.rowCount;

      if (!affectedRows) {
        throw new Error(HTTP_STATUS_CODE_NOT_FOUND.toString());
      }

      return sendResponse(
        {
          ...DEFAULT_SUCCES_API_RESPONSE,
          message: USER_SUCCESSFULLY_DELETED_MESSAGE,
        },
        res
      );
    } catch (err) {
      const customError: CustomError = {
        errorType: ERROR_TYPE_DELETE_USER,
        error: err,
      };

      return next(customError);
    }
  },
};

export default usersController;
