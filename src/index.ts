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
import authRouter from "./routes/auth";
import authMiddleware from "./middlewares/auth";
import { sendResponse } from "./utils";
import errorHandlerMiddleware from "./middlewares/errorHandler";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger";
import experiencesRouter from "./routes/experiences";
import educationRouter from "./routes/education";
import userSkillsRouter from "./routes/userSkills";
import userTechnologiesRouter from "./routes/userTechnologies";
import projectsRouter from "./routes/projects";
import blogsRouter from "./routes/blogs";
import tagsRouter from "./routes/tags";
import externalResourceRouter from "./routes/externalResources";
import projectsMediaRouter from "./routes/projectsMedia";
import projectsTechnologiesRouter from "./routes/projectsTechnologies";
import usersProjectsRouter from "./routes/usersProjects";
import usersBlogsRouter from "./routes/usersBlogs";
import technologiesRouter from "./routes/technologiesRouter";
import skillsRouter from "./routes/skills";

async function start() {
  const app = express();
  const apiRouter = Router();
  const port = process.env.PORT || API_DEFAULT_PORT;
  await connectToDB();
  preload();

  if (process.env.NODE_ENV) {
    logger.info(
      `Development environment detect. Documentation available at 'http://locahost:${port}/documentation'`
    );
    app.use("/documentation", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  }

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
  apiRouter.use("/experiences", authMiddleware, experiencesRouter);
  apiRouter.use("/educations", authMiddleware, educationRouter);

  apiRouter.use("/users/:userID/skills", userSkillsRouter);
  apiRouter.use(
    "/users/:userID/technologies",
    authMiddleware,
    userTechnologiesRouter
  );
  apiRouter.use("/technologies", authMiddleware, technologiesRouter);
  apiRouter.use("/skills", authMiddleware, skillsRouter);

  apiRouter.use("/users/:userID/projects", authMiddleware, usersProjectsRouter);
  apiRouter.use("/users/:userID/blogs", authMiddleware, usersBlogsRouter);

  apiRouter.use("/projects", authMiddleware, projectsRouter);
  apiRouter.use("/projects/:projectID/blogs", authMiddleware, blogsRouter);
  apiRouter.use("/projects/:projectID/tags", authMiddleware, tagsRouter);
  apiRouter.use(
    "/projects/:projectID/external-resources",
    authMiddleware,
    externalResourceRouter
  );
  apiRouter.use(
    "/projects/:projectID/media",
    authMiddleware,
    projectsMediaRouter
  );
  apiRouter.use(
    "/projects/:projectID/technologies",
    projectsTechnologiesRouter
  );

  apiRouter.use(errorHandlerMiddleware);

  app.listen(port, () => {
    logger.info(`✅ Server is running on http://localhost:${port}`);
  });
}

start();
