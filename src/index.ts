import dotenv from "dotenv";
dotenv.config();

import express, { Router, Response } from "express";
import { API_DEFAULT_PORT } from "./constants/setup";
import { ApiResponse } from "./interfaces";
import logger from "./logger";
import usersRouter from "./routes/users";
import connectToDB from "./db";
import preload from "./preload";
import {
  DEFAULT_SUCCES_API_RESPONSE,
  DEFAULT_HEALTH_ENDPOINT_MESSAGE,
} from "./constants/messages";
import { HTTP_STATUS_CODE_OK } from "./constants/constants";
import authRouter from "./routes/auth";
import authMiddleware from "./middlewares/auth";
import { sendResponse } from "./utils";
import errorHandlerMiddleware from "./middlewares/errorHandler";

async function start() {
  const app = express();
  const apiRouter = Router();
  const port = process.env.PORT || API_DEFAULT_PORT;
  await connectToDB();
  preload();

  app.use("/api/v1", apiRouter);

  apiRouter.use(express.json());
  apiRouter.get("/health", (_req, res): Response<ApiResponse<null>> => {
    return sendResponse(
      {
        ...DEFAULT_SUCCES_API_RESPONSE,
        message: DEFAULT_HEALTH_ENDPOINT_MESSAGE,
      },
      res
    );
  });

  apiRouter.use("/auth", authRouter);
  apiRouter.use("/users", authMiddleware, usersRouter);
  apiRouter.use(errorHandlerMiddleware);

  app.listen(port, () => {
    logger.info(`✅ Server is running on http://localhost:${port}`);
  });
}

start();
