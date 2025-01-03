import { MetadataStorage, MikroORM } from '@mikro-orm/core';
import { testConfig } from './config/mikro-orm.test.config';

let _database: MikroORM;

export default async (globalConfig, projectConfig) => {
  const database = await MikroORM.init(testConfig);
  await database.schema.createSchema();
  globalThis.database = database;

  MetadataStorage.clear();
};
