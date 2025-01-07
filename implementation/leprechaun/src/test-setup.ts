import { MetadataStorage, MikroORM } from '@mikro-orm/core';
import { testConfig } from './config/mikro-orm.test.config';

declare global {
  var database: MikroORM;
}

export default async (_: unknown, __: unknown) => {
  const database = await MikroORM.init(testConfig);
  await database.schema.createSchema();
  globalThis.database = database;

  MetadataStorage.clear();
};
