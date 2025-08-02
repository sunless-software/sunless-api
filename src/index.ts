import dotenv from "dotenv";
dotenv.config();

import express, { Router, Response } from "express";
import { API_DEFAULT_PORT } from "./constants/setup";
import { ApiResponse } from "./interfaces";
import logger from "./logger";
import usersRouter from "./routes/users";
import connectToDB from "./db";

async function start() {
  const app = express();
  const apiRouter = Router();
  const port = process.env.PORT || API_DEFAULT_PORT;
  await connectToDB();

  app.use("/api/v1", apiRouter);
  apiRouter.use(express.json());
  apiRouter.get("/health", (req, res): Response<ApiResponse<[]>> => {
    return res.json({
      status: 200,
      message: "May the moon shine upon you, Sunless one.",
      data: [],
    });
  });
  apiRouter.use(usersRouter);

  app.listen(port, () => {
    logger.info(`✅ Server is running on http://localhost:${port}`);
  });
}

start();
