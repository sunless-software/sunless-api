import { Pool } from "pg";
import connectToDB from "./db";
import { encryptPassword } from "./utils";
import {
  DEVELOPMENT_GLOBAL_ROLES,
  DEVELOPMENT_PROJECT_ROLES,
  DEVELOPMENT_USERS,
  DEVELOPMENT_USERS_EDUCATIONS,
  DEVELOPMENT_USERS_EXPERIENCES,
  DEVELOPMENT_USERS_SKILLS,
  DEVELOPMENT_USERS_TECHNOLOGIES,
} from "./constants/developmentData";
import { Entities } from "./constants/entities";
import { NODE_ENV_DEVELOPMENT } from "./constants/constants";
import { GLOBAL_PERMISSIONS } from "./constants/globalPermissions";
import {
  DEFAULT_SKILLS,
  DEFAULT_TAGS,
  DEFAULT_TECHNOLOGIES,
} from "./constants/defaultData";
import logger from "./logger";
import EntityPreloader from "./classes/EntityPreloader";
import { PROJECT_PERMISSIONS } from "./constants/projectPermissions";

export default async function preload() {
  const development = process.env.NODE_ENV === NODE_ENV_DEVELOPMENT;
  const dbConnection = await connectToDB();
  const entityPreloader = new EntityPreloader(dbConnection);

  if (development) {
    logger.info("Non production environment detected!");
    await wipeDB(dbConnection);
  }

  const globalPermissionsData = Object.values(GLOBAL_PERMISSIONS).map(
    ({ id, ...rest }) => {
      return { ...rest, scope: "GLOBAL" };
    }
  );
  const projectPermissionsData = Object.values(PROJECT_PERMISSIONS).map(
    ({ id, ...rest }) => {
      return { ...rest, scope: "PROJECT" };
    }
  );

  await Promise.all([
    entityPreloader.PreloadDefaultData("permissions", [
      ...globalPermissionsData,
      ...projectPermissionsData,
    ]),
    entityPreloader.PreloadDefaultData("skills", DEFAULT_SKILLS),
    entityPreloader.PreloadDefaultData("technologies", DEFAULT_TECHNOLOGIES),
  ]);

  if (development) {
    const usersWithHashedPasswords = await Promise.all(
      DEVELOPMENT_USERS.map(async (u) => ({
        ...u,
        password: await encryptPassword(u.password),
      }))
    );
    const developmentGlobalRolesData = DEVELOPMENT_GLOBAL_ROLES.map((r) => {
      return { role_name: r.role_name };
    });
    const developmentProjectRolesData = DEVELOPMENT_PROJECT_ROLES.map((r) => {
      return { role_name: r.role_name };
    });

    await entityPreloader.PreloadDefaultData(
      "global_roles",
      developmentGlobalRolesData
    );
    await associateDevGlobalRolesPermissions(entityPreloader);
    await entityPreloader.PreloadDefaultData("users", usersWithHashedPasswords);

    await Promise.all([
      entityPreloader.PreloadDefaultData(
        "project_roles",
        developmentProjectRolesData
      ),
      entityPreloader.PreloadDefaultData(
        "experiences",
        DEVELOPMENT_USERS_EXPERIENCES
      ),
      entityPreloader.PreloadDefaultData(
        "educations",
        DEVELOPMENT_USERS_EDUCATIONS
      ),
      entityPreloader.PreloadDefaultData(
        "users_technologies",
        DEVELOPMENT_USERS_TECHNOLOGIES
      ),
      entityPreloader.PreloadDefaultData(
        "users_skills",
        DEVELOPMENT_USERS_SKILLS
      ),
      entityPreloader.PreloadDefaultData("tags", DEFAULT_TAGS),
    ]);

    await associateDevProjectRolesPermissions(entityPreloader);
  }
}

async function wipeDB(db: Pool) {
  logger.info("Wiping DB ...");

  let query = `TRUNCATE TABLE `;
  query += Object.keys(Entities)
    .map((entity) => entity)
    .join(",");
  query += " RESTART IDENTITY CASCADE";

  return db
    .query(query)
    .then(() => {
      logger.info(`All data from DB was successfully wiped.`);
    })
    .catch((err) => {
      logger.error(
        `The following error has occurred while trying to wipe the DB:`
      );
      logger.error(err);
    });
}

function associateDevGlobalRolesPermissions(entityPreloader: EntityPreloader) {
  const globalDevRolesPermissionsData = DEVELOPMENT_GLOBAL_ROLES.flatMap((r) =>
    r.permissions.map((p) => ({
      global_role_id: r.id,
      permission_id: p.id,
    }))
  );

  return entityPreloader.PreloadDefaultData(
    "global_role_permissions",
    globalDevRolesPermissionsData
  );
}

function associateDevProjectRolesPermissions(entityPreloader: EntityPreloader) {
  const projectDevRolesPermissionsData = DEVELOPMENT_PROJECT_ROLES.flatMap(
    (r) =>
      r.permissions.map((p) => ({
        project_role_id: r.id,
        permission_id: p.id,
      }))
  );

  return entityPreloader.PreloadDefaultData(
    "project_role_permissions",
    projectDevRolesPermissionsData
  );
}
