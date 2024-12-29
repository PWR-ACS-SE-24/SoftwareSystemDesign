import { defineConfig } from '@mikro-orm/postgresql';

export default defineConfig({
  dbName: 'leprechaun',

  entities: ['./dist/**/database/*.entity.js'],
  entitiesTs: ['./src/**/database/*.entity.ts'],
  clientUrl: 'postgresql://postgres:test@localhost:5432/leprechaun',
  debug: true,
});
