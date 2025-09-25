import { NextFunction, Request, Response } from "express";
import connectToDB from "../db";
import {
  BAN_USER,
  COUNT_USERS,
  CREATE_USER,
  CREATE_USER_PROFILE,
  GET_USER_CREDENTIALS,
  GET_USER_DETAILS,
  GET_USER_PASSWORD,
  GET_USERS,
  PATCH_USER,
  RECOVER_USER,
  SOFT_DELETE_USER,
  UNBAN_USER,
  UPDATE_USER_PASSWORD,
  UPDATE_USER_ROLE,
} from "../constants/queries";
import { checkPassword, encryptPassword, sendResponse } from "../utils";
import {
  DEFAULT_SUCCES_API_RESPONSE,
  PASSWORD_SUCCESSFULLY_UPDATED,
  USER_DETAILS_SUCCESSFULLY_RETRIEVED_MESSAGE,
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
  HTTP_STATUS_CODE_UNAUTHORIZED,
} from "../constants/httpStatusCodes";
import { AuthRequest, User } from "../interfaces";
import { GET_USERS_DEFAULT_LIMIT } from "../constants/setup";

const usersController = {
  getUsers: async (req: Request, res: Response, next: NextFunction) => {
    const {
      offset = 0,
      limit = GET_USERS_DEFAULT_LIMIT,
      showPrivateUsers = false,
      showBannedUsers = false,
      showDeletedUsers = false,
      username = null,
    } = req.query;

    const db = await connectToDB();

    try {
      const [countUsersResult, getUsersResult] = await Promise.all([
        db.query(COUNT_USERS, [
          showPrivateUsers,
          showBannedUsers,
          showDeletedUsers,
          username,
        ]),
        db.query(GET_USERS, [
          showPrivateUsers,
          showBannedUsers,
          showDeletedUsers,
          username,
          offset,
          limit,
        ]),
      ]);
      const users: Array<User> = getUsersResult.rows;

      return sendResponse(
        {
          ...DEFAULT_SUCCES_API_RESPONSE,
          message: USERS_SUCCESSFULLY_RETRIEVED_MESSAGE,
          data: users,
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
      console.log(err);
      return next(err);
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
      jobTitle,
      shortDescription,
      publicProfile,
    } = req.body;

    const db = await connectToDB();
    const hashedPassword = await encryptPassword(password);

    try {
      await db.query("BEGIN");

      const result = await db.query(CREATE_USER, [
        roleID,
        username,
        hashedPassword,
        profilePhoto,
        phone,
        email,
        shortDescription,
        jobTitle,
        publicProfile,
        false,
        false,
      ]);

      const createdUserData = result.rows[0];

      await db.query(CREATE_USER_PROFILE, [createdUserData.id]);
      await db.query("COMMIT");

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
      console.log(err);
      await db.query("ROLLBACK");
      return next(err);
    }
  },
  deleteUser: async (req: Request, res: Response, next: NextFunction) => {
    const { userID } = req.params;
    const db = await connectToDB();

    try {
      const response = await db.query(SOFT_DELETE_USER, [userID]);
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
      return next(err);
    }
  },
  recoverUser: async (req: Request, res: Response, next: NextFunction) => {
    const { userID } = req.params;
    const db = await connectToDB();

    try {
      const response = await db.query(RECOVER_USER, [userID]);
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
      return next(err);
    }
  },
  banUser: async (req: Request, res: Response, next: NextFunction) => {
    const { userID } = req.params;
    const db = await connectToDB();

    try {
      const response = await db.query(BAN_USER, [userID]);
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
      return next(err);
    }
  },
  unbanUser: async (req: Request, res: Response, next: NextFunction) => {
    const { userID } = req.params;
    const db = await connectToDB();

    try {
      const response = await db.query(UNBAN_USER, [userID]);
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
      return next(err);
    }
  },
  updateRole: async (req: Request, res: Response, next: NextFunction) => {
    const { userID } = req.params;
    const { roleID } = req.body;
    const db = await connectToDB();

    try {
      const result = await db.query(UPDATE_USER_ROLE, [roleID, userID]);
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
      return next(err);
    }
  },
  changePassword: async (req: Request, res: Response, next: NextFunction) => {
    const { userID } = req.params;
    const { currentPassword, newPassword } = req.body;
    const id = userID || (req as AuthRequest).user.id;

    const db = await connectToDB();

    try {
      const resultUserCredentials = await db.query(GET_USER_PASSWORD, [id]);

      if (!resultUserCredentials.rowCount) {
        throw new Error(HTTP_STATUS_CODE_NOT_FOUND.toString());
      }

      const currentHashedPassword = resultUserCredentials.rows[0].password;

      if (!userID) {
        const passwordMatch = await checkPassword(
          currentPassword,
          currentHashedPassword
        );

        if (!passwordMatch) {
          return sendResponse(
            {
              ...DEFAULT_SUCCES_API_RESPONSE,
              status: HTTP_STATUS_CODE_UNAUTHORIZED,
              message: "Invalid credentials",
            },
            res
          );
        }
      }

      const newHashedPassword = await encryptPassword(newPassword);
      await db.query(UPDATE_USER_PASSWORD, [newHashedPassword, id]);

      return sendResponse(
        {
          ...DEFAULT_SUCCES_API_RESPONSE,
          message: PASSWORD_SUCCESSFULLY_UPDATED,
        },
        res
      );
    } catch (err) {
      return next(err);
    }
  },
  updateUser: async (req: Request, res: Response, next: NextFunction) => {
    const { userID } = req.params;
    const {
      username,
      profilePhoto,
      phone,
      email,
      publicProfile,
      shortDescription,
      jobTitle,
    } = req.body;
    const db = await connectToDB();

    try {
      const result = await db.query(PATCH_USER, [
        username,
        profilePhoto,
        phone,
        email,
        shortDescription,
        jobTitle,
        publicProfile,
        userID,
      ]);
      const affectedRows = result.rowCount;

      if (!affectedRows) {
        throw new Error(HTTP_STATUS_CODE_NOT_FOUND.toString());
      }

      return sendResponse(
        {
          ...DEFAULT_SUCCES_API_RESPONSE,
          message: USER_SUCESSFULLY_UPDATED,
          data: result.rows,
        },
        res
      );
    } catch (err) {
      return next(err);
    }
  },
  getUserDetails: async (req: Request, res: Response, next: NextFunction) => {
    const { userID } = req.params;
    const {
      showPrivateUsers = false,
      showBannedUsers = false,
      showDeletedUsers = false,
    } = req.query;
    const db = await connectToDB();

    try {
      const result = await db.query(GET_USER_DETAILS, [
        userID,
        showPrivateUsers,
        showBannedUsers,
        showDeletedUsers,
      ]);

      if (!result.rowCount) {
        throw new Error(HTTP_STATUS_CODE_NOT_FOUND.toString());
      }

      sendResponse(
        {
          ...DEFAULT_SUCCES_API_RESPONSE,
          message: USER_DETAILS_SUCCESSFULLY_RETRIEVED_MESSAGE,
          data: [result.rows[0]],
        },
        res
      );
    } catch (err) {
      return next(err);
    }
  },
};

export default usersController;
