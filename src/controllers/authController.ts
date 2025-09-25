import { Request, Response } from "express";
import connectToDB from "../db";
import { DEFAULT_SUCCES_API_RESPONSE } from "../constants/messages";
import { checkPassword, sendResponse, signJWT } from "../utils";
import {
  HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_CODE_UNAUTHORIZED,
} from "../constants/httpStatusCodes";
import { GET_USER_CREDENTIALS } from "../constants/queries";
import { SESSION_LIFE_TIME } from "../constants/setup";
import logger from "../logger";

const authController = {
  login: async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const db = await connectToDB();
    const secret = process.env.SECRET;
    const SECRET_NOT_FOUND_MESSAGE = `Secret not found, please, contact an admin or if you have access check server logs for more info`;
    const SUCCESSFUL_LOGIN_MESSAGE = "You are welcome, son of Nix";
    const FAILURE_RESPONSE = {
      ...DEFAULT_SUCCES_API_RESPONSE,
      status: HTTP_STATUS_CODE_UNAUTHORIZED,
      message: "Invalid credentials",
    };

    if (!secret) {
      logger.error(
        `The value of the environment variable "SECRET" was not found. Please check if it exists in the .env file.`
      );

      return sendResponse(
        {
          ...DEFAULT_SUCCES_API_RESPONSE,
          status: HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR,
          message: SECRET_NOT_FOUND_MESSAGE,
        },
        res
      );
    }

    const result = await db.query(GET_USER_CREDENTIALS, [username]);
    if (!result.rows.length) {
      logger.warn(
        `New connection attempt using the username "${username}" was rejected. User not found.`
      );
      return sendResponse(FAILURE_RESPONSE, res);
    }

    const correctPassword = await checkPassword(
      password,
      result.rows[0].password
    );
    if (!correctPassword) {
      logger.warn(
        `New connection attempt from user "${username}" was rejected. Invalid credentials.`
      );
      return sendResponse(FAILURE_RESPONSE, res);
    }

    const payload = {
      id: result.rows[0].id,
      username: result.rows[0].username,
    };

    const token = signJWT(payload, secret, SESSION_LIFE_TIME);
    logger.info(`New connection from user "${result.rows[0].username}"`);

    return sendResponse(
      {
        ...DEFAULT_SUCCES_API_RESPONSE,
        message: SUCCESSFUL_LOGIN_MESSAGE,
        data: [{ token: token }],
      },
      res
    );
  },
};

export default authController;
