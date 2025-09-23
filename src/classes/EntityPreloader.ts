import { Pool } from "pg";
import logger from "../logger";

export default class EntityPreloader {
  private db: Pool;

  constructor(db: Pool) {
    this.db = db;
  }

  public async PreloadDefaultData(
    tableName: string,
    defaultData: Array<object>,
    skipConflict: boolean = false
  ) {
    logger.info(`Loading default data for '${tableName}' ...`);

    const tableFields = Object.keys(defaultData[0]).join(",");
    let query = `INSERT INTO ${tableName} (${tableFields}) VALUES `;

    query += defaultData.map((d) => {
      const keys = Object.keys(d);

      return `(${keys.map((k) => {
        const columnValue = d[k as keyof typeof d];
        return columnValue !== null ? `'${columnValue}'` : "NULL";
      })})`;
    });

    if (skipConflict) {
      query += " ON CONFLICT DO NOTHING";
    }

    return this.db
      .query(query)
      .then(() => {
        logger.info(`Default data for '${tableName}' successfully loaded.`);
      })
      .catch((err) => {
        logger.error(
          `The following error has occurred while trying to load the default data for '${tableName}': `
        );
        logger.error(err);
      });
  }
}
