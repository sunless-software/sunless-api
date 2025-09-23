import { Pool } from "pg";
import connectToDB from "./db";
import { encryptPassword } from "./utils";
import {
  DEVELOPMENT_GLOBAL_ROLES,
  DEVELOPMENT_PROJECT_ROLES,
  DEVELOPMENT_USER_PROFILES,
  DEVELOPMENT_USERS,
  DEVELOPMENT_USERS_EDUCATIONS,
  DEVELOPMENT_USERS_EXPERIENCES,
  DEVELOPMENT_USERS_SKILLS,
  DEVELOPMENT_USERS_TECHNOLOGIES,
  DEVELOPMENT_SKILLS,
  DEVELOPMENT_TAGS,
  DEVELOPMENT_TECHNOLOGIES,
} from "./constants/developmentData";
import { Entities } from "./constants/entities";
import { NODE_ENV_DEVELOPMENT } from "./constants/constants";
import { GLOBAL_PERMISSIONS } from "./constants/globalPermissions";
import logger from "./logger";
import EntityPreloader from "./classes/EntityPreloader";
import { PROJECT_PERMISSIONS } from "./constants/projectPermissions";
import {
  PRODUCTION_DEFAULT_GLOBAL_ROLES,
  PRODUCTION_DEFAULT_PROJECT_ROLES,
} from "./constants/defaultData";
import { DefaultRole } from "./interfaces";

export default async function preload() {
  const development = process.env.NODE_ENV === NODE_ENV_DEVELOPMENT;
  const dbConnection = await connectToDB();
  const entityPreloader = new EntityPreloader(dbConnection);

  if (development) {
    logger.info("Non production environment detected!");
    await wipeDB(dbConnection);
  }

  await createDefaultPermissions(entityPreloader);

  if (development) {
    // Development
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

    // In order to create an user, the global_role must exist before
    await entityPreloader.PreloadDefaultData(
      "global_roles",
      developmentGlobalRolesData
    );
    await associateGlobalRolesPermissions(
      entityPreloader,
      DEVELOPMENT_GLOBAL_ROLES
    );

    // The user must exist so after i can relate educations, experiences, etc
    // Technologies must exist so after i can relate user and technologies
    await Promise.all([
      entityPreloader.PreloadDefaultData("users", usersWithHashedPasswords),
      entityPreloader.PreloadDefaultData(
        "technologies",
        DEVELOPMENT_TECHNOLOGIES
      ),
    ]);

    await Promise.all([
      entityPreloader.PreloadDefaultData("skills", DEVELOPMENT_SKILLS),
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
      entityPreloader.PreloadDefaultData("tags", DEVELOPMENT_TAGS),
      entityPreloader.PreloadDefaultData(
        "user_profiles",
        DEVELOPMENT_USER_PROFILES
      ),
    ]);

    await associateProjectRolesPermissions(
      entityPreloader,
      DEVELOPMENT_PROJECT_ROLES
    );
  } else {
    // Production
    const prodGlobalRolesData = PRODUCTION_DEFAULT_GLOBAL_ROLES.map((r) => {
      return { role_name: r.role_name };
    });
    const prodProjectRolesData = PRODUCTION_DEFAULT_PROJECT_ROLES.map((r) => {
      return { role_name: r.role_name };
    });

    const defaultUser = {
      username: process.env.DEFAULT_USER_USERNAME,
      password: await encryptPassword(
        process.env.DEFAULT_USER_PASSWORD || "Password123!"
      ),
      job_title: "-",
      rol_id: 1,
      public: false,
      banned: false,
      deleted: false,
    };

    await Promise.all([
      entityPreloader.PreloadDefaultData(
        "global_roles",
        prodGlobalRolesData,
        true
      ),
      entityPreloader.PreloadDefaultData(
        "project_roles",
        prodProjectRolesData,
        true
      ),
    ]);

    await Promise.all([
      associateGlobalRolesPermissions(
        entityPreloader,
        PRODUCTION_DEFAULT_GLOBAL_ROLES,
        true
      ),
      associateProjectRolesPermissions(
        entityPreloader,
        PRODUCTION_DEFAULT_PROJECT_ROLES,
        true
      ),
    ]);

    await entityPreloader.PreloadDefaultData("users", [defaultUser], true);
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

function associateGlobalRolesPermissions(
  entityPreloader: EntityPreloader,
  globalRoles: Array<DefaultRole>,
  skipConflict: boolean = false
) {
  const globalRolesPermissionsData = globalRoles.flatMap((r) =>
    r.permissions.map((p) => ({
      global_role_id: r.id,
      permission_id: p.id,
    }))
  );

  return entityPreloader.PreloadDefaultData(
    "global_role_permissions",
    globalRolesPermissionsData,
    skipConflict
  );
}

function associateProjectRolesPermissions(
  entityPreloader: EntityPreloader,
  projectRoles: Array<DefaultRole>,
  skipConflict: boolean = false
) {
  const projectRolesPermissionsData = projectRoles.flatMap((r) =>
    r.permissions.map((p) => ({
      project_role_id: r.id,
      permission_id: p.id,
    }))
  );

  return entityPreloader.PreloadDefaultData(
    "project_role_permissions",
    projectRolesPermissionsData,
    skipConflict
  );
}

async function createDefaultPermissions(entityPreloader: EntityPreloader) {
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

  return entityPreloader.PreloadDefaultData(
    "permissions",
    [...globalPermissionsData, ...projectPermissionsData],
    true
  );
}
