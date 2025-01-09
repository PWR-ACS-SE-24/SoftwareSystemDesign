import 'tsconfig-paths/register';

export default async (_: unknown, __: unknown) => {
  const database = globalThis.database;
  await database.schema.dropDatabase();
  await database.close(true);
};
