import { defineConfig } from '@mikro-orm/postgresql';
import config from './config';

export default defineConfig({
  dbName: config.LEPRECHAUN_DATABASE_DBNAME,
  clientUrl: config.LEPRECHAUN_DATABASE_HOST,

  entities: ['./dist/**/database/*.entity.js'],
  entitiesTs: ['./src/**/database/*.entity.ts'],
});
