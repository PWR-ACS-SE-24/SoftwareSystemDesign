import { MikroORM } from '@mikro-orm/core';

export default async (globalConfig, projectConfig) => {
  const database: MikroORM = globalThis.database;
  await database.schema.dropDatabase();
  await database.close(true);
};
