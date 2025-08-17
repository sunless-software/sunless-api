import { NextFunction, Request, Response } from "express";
import connectToDB from "../db";
import {
  BAN_USER,
  COUNT_USERS,
  CREATE_USER,
  GET_USERS,
  PATCH_USER,
  RECOVER_USER,
  SOFT_DELETE_USER,
  UNBAN_USER,
  UPDATE_USER_ROLE,
} from "../constants/queries";
import { encryptPassword, sendResponse } from "../utils";
import {
  DEFAULT_SUCCES_API_RESPONSE,
  USER_ROLE_SUCCESSFULY_UPDATED,
  USER_SUCCESSFUL_CREATION_MESSAGE,
  USER_SUCCESSFULLY_BANNED_MESSAGE,
  USER_SUCCESSFULLY_DELETED_MESSAGE,
  USER_SUCCESSFULLY_RECOVERED_MESSAGE,
  USER_SUCCESSFULLY_UNBANNED_MESSAGE,
  USER_SUCESSFULLY_UPDATED,
  USERS_SUCCESSFULLY_RETRIEVED_MESSAGE,
} from "../constants/messages";
import {
  HTTP_STATUS_CODE_CREATED,
  HTTP_STATUS_CODE_NOT_FOUND,
} from "../constants/httpStatusCodes";
import {
  ERROR_TYPE_BAN_USER,
  ERROR_TYPE_CREATE_USER,
  ERROR_TYPE_DELETE_USER,
  ERROR_TYPE_GET_USERS,
  ERROR_TYPE_RECOVER_USER,
  ERROR_TYPE_UNBAN_USER,
  ERROR_TYPE_UPDATE_USER,
  ERROR_TYPE_UPDATE_USER_ROLE,
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

    const countUsersQuery = COUNT_USERS.replace(`_1`, whereClause);
    const getUsersQuery = GET_USERS.replace(`_1`, whereClause);

    try {
      const [countUsersResult, getUsersResult] = await Promise.all([
        db.query(countUsersQuery),
        db.query(getUsersQuery, [offset, limit]),
      ]);
      const users: Array<User> = getUsersResult.rows;

      return sendResponse(
        {
          ...DEFAULT_SUCCES_API_RESPONSE,
          message: USERS_SUCCESSFULLY_RETRIEVED_MESSAGE,
          data: [users],
          pagination: {
            offset:
              typeof offset === "string"
                ? parseInt(offset)
                : (offset as number),
            limit:
              typeof limit === "string" ? parseInt(limit) : (limit as number),
            count: users.length,
            total: parseInt(countUsersResult.rows[0].total),
          },
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
          data: [createdUserData],
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
  recoverUser: async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const db = await connectToDB();

    try {
      const response = await db.query(RECOVER_USER, [id]);
      const affectedRows = response.rowCount;

      if (!affectedRows) {
        throw new Error(HTTP_STATUS_CODE_NOT_FOUND.toString());
      }

      return sendResponse(
        {
          ...DEFAULT_SUCCES_API_RESPONSE,
          message: USER_SUCCESSFULLY_RECOVERED_MESSAGE,
        },
        res
      );
    } catch (err) {
      const customError: CustomError = {
        errorType: ERROR_TYPE_RECOVER_USER,
        error: err,
      };

      return next(customError);
    }
  },
  banUser: async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const db = await connectToDB();

    try {
      const response = await db.query(BAN_USER, [id]);
      const affectedRows = response.rowCount;

      if (!affectedRows) {
        throw new Error(HTTP_STATUS_CODE_NOT_FOUND.toString());
      }

      return sendResponse(
        {
          ...DEFAULT_SUCCES_API_RESPONSE,
          message: USER_SUCCESSFULLY_BANNED_MESSAGE,
        },
        res
      );
    } catch (err) {
      const customError: CustomError = {
        errorType: ERROR_TYPE_BAN_USER,
        error: err,
      };

      return next(customError);
    }
  },
  unbanUser: async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const db = await connectToDB();

    try {
      const response = await db.query(UNBAN_USER, [id]);
      const affectedRows = response.rowCount;

      if (!affectedRows) {
        throw new Error(HTTP_STATUS_CODE_NOT_FOUND.toString());
      }

      return sendResponse(
        {
          ...DEFAULT_SUCCES_API_RESPONSE,
          message: USER_SUCCESSFULLY_UNBANNED_MESSAGE,
        },
        res
      );
    } catch (err) {
      const customError: CustomError = {
        errorType: ERROR_TYPE_UNBAN_USER,
        error: err,
      };

      return next(customError);
    }
  },
  updateRole: async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { roleID } = req.body;
    const db = await connectToDB();

    try {
      const result = await db.query(UPDATE_USER_ROLE, [roleID, id]);
      const affectedRows = result.rowCount;

      if (!affectedRows) {
        throw new Error(HTTP_STATUS_CODE_NOT_FOUND.toString());
      }

      return sendResponse(
        {
          ...DEFAULT_SUCCES_API_RESPONSE,
          message: USER_ROLE_SUCCESSFULY_UPDATED,
        },
        res
      );
    } catch (err) {
      const customError: CustomError = {
        errorType: ERROR_TYPE_UPDATE_USER_ROLE,
        error: err,
      };

      return next(customError);
    }
  },
  recoverPassword: async (req: Request, res: Response, next: NextFunction) => {
    // Quiero recuprera MI password
    // El endpoint recibe el mail del usuario y
  },
  updateUser: async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { username, profilePhoto, phone, email, publicProfile } = req.body;
    const db = await connectToDB();

    try {
      const result = await db.query(PATCH_USER, [
        username,
        profilePhoto,
        phone,
        email,
        publicProfile,
        id,
      ]);
      const affectedRows = result.rowCount;

      if (!affectedRows) {
        throw new Error(HTTP_STATUS_CODE_NOT_FOUND.toString());
      }

      return sendResponse(
        {
          ...DEFAULT_SUCCES_API_RESPONSE,
          message: USER_SUCESSFULLY_UPDATED,
          data: result.rows[0],
        },
        res
      );
    } catch (err) {
      const customError: CustomError = {
        errorType: ERROR_TYPE_UPDATE_USER,
        error: err,
      };

      return next(customError);
    }
  },
};

export default usersController;
