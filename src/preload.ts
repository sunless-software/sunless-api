import { Pool } from "pg";
import connectToDB from "./db";
import { encryptPassword } from "./utils";
import {
  DEVELOPMENT_GLOBAL_ROLES,
  DEVELOPMENT_USERS,
} from "./constants/developmentData";
import { Entities } from "./constants/entities";
import { NODE_ENV_DEVELOPMENT } from "./constants/constants";
import { GLOBAL_PERMISSIONS } from "./constants/globalPermissions";
import { DEFAULT_SKILLS } from "./constants/defaultData";
import logger from "./logger";

export default async function preload() {
  const development = process.env.NODE_ENV === NODE_ENV_DEVELOPMENT;
  const dbConnection = await connectToDB();

  if (development) {
    logger.info("Non production environment detected!");
    await wipeDB(dbConnection);
  }

  await Promise.all([
    createPermissions(dbConnection),
    createDefaultSkills(dbConnection),
  ]);

  if (development) {
    await createDevelopmentGlobalRoles(dbConnection);
    await associateDevGlobalRolesPermissions(dbConnection);
    await createDevelopmentUsers(dbConnection);
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

async function createPermissions(db: Pool) {
  logger.info(`Creating default permissions ...`);

  const initialQuery =
    'INSERT INTO permissions ("name", "scope", created_at, updated_at) VALUES';
  const values = Object.values(GLOBAL_PERMISSIONS)
    .map(
      (permission) =>
        `('${permission.name}', '${permission.scope}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
    )
    .join(",");
  const finalQuery = `${initialQuery} ${values}`;

  return db
    .query(finalQuery)
    .then(() => {
      logger.info("Default permissions successfully created.");
    })
    .catch((err) => {
      logger.error(
        "The following error has occurred while trying to create the permissions: "
      );
      logger.error(err);
    });
}

async function createDevelopmentGlobalRoles(db: Pool) {
  logger.info("Creating development roles ...");

  let query = `INSERT INTO global_roles (role_name, created_at, updated_at) VALUES `;
  query += DEVELOPMENT_GLOBAL_ROLES.map(
    (role) => `('${role.name}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
  ).join(",");

  return db
    .query(query)
    .then(() => {
      logger.info("Development roles successfully created.");
    })
    .catch((err) => {
      logger.error(
        "The following error has occurred while trying to create the development roles: "
      );
      logger.error(err);
    });
}

async function associateDevGlobalRolesPermissions(db: Pool) {
  logger.info("Associating development roles and permissions ...");

  let query = `INSERT INTO global_role_permissions 
(global_role_id, permission_id, created_at, updated_at) VALUES `;

  query += DEVELOPMENT_GLOBAL_ROLES.map((role) => {
    return role.permissions.map((permissions) => {
      return `(${role.id}, ${permissions.id}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;
    });
  })
    .filter((associations) => associations.length)
    .join(",");

  return db
    .query(query)
    .then(() => {
      logger.info(
        `Permissions associations with development roles where successfully created.`
      );
    })
    .catch((err) => {
      logger.error(
        `The following error has occurred while trying to associate the permissions with the development roles: `
      );
      logger.error(err);
    });
}

async function createDevelopmentUsers(db: Pool) {
  logger.info("Creating development users ...");

  let query = `INSERT INTO users (rol_id, username, password, profile_photo, phone, 
  email, public, banned, deleted, created_at, updated_at) VALUES `;
  query += DEVELOPMENT_USERS.map((user, index) => {
    return `(${user.role_id}, '${user.username}', $${
      index + 1
    }, ${null}, ${null}, ${null}, true, false, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;
  }).join(",");
  const hashedPasswords = await Promise.all(
    DEVELOPMENT_USERS.map(async (user) => encryptPassword(user.password))
  );

  return db
    .query(query, hashedPasswords)
    .then(() => {
      logger.info("Development users successfully created.");
    })
    .catch((err) => {
      logger.error(
        `The following error has occurred while trying to create the development users: `
      );
      logger.error(err);
    });
}

async function createDefaultSkills(db: Pool) {
  logger.info("Creating default skills ...");

  let query = `INSERT INTO skills ("name", created_at, updated_at) VALUES `;
  query += DEFAULT_SKILLS.map((skill) => {
    return `('${skill.name}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;
  }).join(",");

  return db
    .query(query)
    .then(() => {
      logger.info("Default skills successfully created.");
    })
    .catch((err) => {
      logger.error(
        `The following error has occurred while trying to create the default skills: `
      );
      logger.error(err);
    });
}
