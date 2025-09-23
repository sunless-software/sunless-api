import { Pool } from "pg";
import logger from "./logger";

let connection: Pool | undefined = undefined;

export default async function connectToDB() {
  if (connection) return connection;

  connection = new Pool({
    host: process.env.POSTGRES_HOST || "localhost",
    port: Number(process.env.POSTGRES_PORT),
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  });

  try {
    await connection.query("SELECT 1");
    logger.info(`The connection to the DB has been successfully established.`);
  } catch (err) {
    logger.error(
      `The following error has occurred while trying to establish a connection to the DB: `
    );
    logger.error(err);

    throw new Error(
      "Unnable to establish connection to the DB. Check logs for more info."
    );
  }

  return connection;
}
