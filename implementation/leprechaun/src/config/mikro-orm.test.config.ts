import { Options } from '@mikro-orm/postgresql';
import defaultConfig from './mikro-orm.config';

export const testConfig: Options = {
  ...defaultConfig,
  ensureDatabase: true,
  verbose: false,
  allowGlobalContext: true,
  disableIdentityMap: true,
  debug: [],
  dbName: 'test_leprechaun',
};
