import { Pool } from "pg";
import connectToDB from "./db";
import { encryptPassword } from "./utils";
import { CREATE_USER_NO_CONFLICT } from "./constants/queries";
import { NODE_ENV_DEVELOPMENT } from "./constants/constants";
import logger from "./logger";

export default async function preload() {
  if (process.env.NODE_ENV !== NODE_ENV_DEVELOPMENT) {
    logger.info(
      "Non development environment detected. Skipping development entities preload."
    );
    return;
  }

  logger.warn(
    `Development environment detected! entities prealoding starting ..`
  );

  const dbConnection = await connectToDB();
  createTestUser(dbConnection);
}

async function createTestUser(db: Pool) {
  const username = "sunless_test";
  const password = "Password123!";
  const hashedPassword = await encryptPassword(password);
  const rol_id = 1;

  try {
    await db.query(CREATE_USER_NO_CONFLICT, [
      rol_id,
      username,
      hashedPassword,
      null,
      null,
      null,
      true,
      false,
      false,
    ]);

    logger.info("test user successfully created.");
  } catch (err) {
    logger.error(
      "The following error has occurred while trying to create the testing user: "
    );
    logger.error(err);
  }
}
