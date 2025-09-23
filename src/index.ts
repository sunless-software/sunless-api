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
import projectTagsRouter from "./routes/projectTags";
import externalResourceRouter from "./routes/externalResources";
import projectsMediaRouter from "./routes/projectsMedia";
import projectsTechnologiesRouter from "./routes/projectsTechnologies";
import usersProjectsRouter from "./routes/usersProjects";
import usersBlogsRouter from "./routes/usersBlogs";
import technologiesRouter from "./routes/technologiesRouter";
import skillsRouter from "./routes/skills";
import userProfilesRouter from "./routes/userProfiles";
import tagsRouter from "./routes/tagsRouter";
import globalRolesRouter from "./routes/globalRoles";
import permissionsRouter from "./routes/permissions";
import projectRolesRouter from "./routes/projectRoles";

async function start() {
  const app = express();
  const apiRouter = Router();
  const port = process.env.PORT || API_DEFAULT_PORT;
  await connectToDB();
  preload();

  app.use("/documentation", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
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
  apiRouter.use(
    "/users/:userID/experiences",
    authMiddleware,
    experiencesRouter
  );
  apiRouter.use("/users/:userID/educations", authMiddleware, educationRouter);
  apiRouter.use("/users/:userID/skills", userSkillsRouter);
  apiRouter.use(
    "/users/:userID/technologies",
    authMiddleware,
    userTechnologiesRouter
  );
  apiRouter.use("/users/:userID/profile", authMiddleware, userProfilesRouter);
  apiRouter.use("/users/:userID/projects", authMiddleware, usersProjectsRouter);
  apiRouter.use("/users/:userID/blogs", authMiddleware, usersBlogsRouter);

  apiRouter.use("/tags", authMiddleware, tagsRouter);
  apiRouter.use("/technologies", authMiddleware, technologiesRouter);
  apiRouter.use("/skills", authMiddleware, skillsRouter);

  apiRouter.use("/projects", authMiddleware, projectsRouter);
  apiRouter.use("/projects/:projectID/blogs", authMiddleware, blogsRouter);
  apiRouter.use("/projects/:projectID/tags", authMiddleware, projectTagsRouter);
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

  apiRouter.use("/roles/permissions", authMiddleware, permissionsRouter);
  apiRouter.use("/roles/global", authMiddleware, globalRolesRouter);
  apiRouter.use("/roles/project", authMiddleware, projectRolesRouter);

  apiRouter.use(errorHandlerMiddleware);

  app.listen(port, () => {
    logger.info(`✅ Server is running on http://localhost:${port}`);
  });
}

start();
