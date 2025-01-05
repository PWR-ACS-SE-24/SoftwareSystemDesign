import { buildApi } from "@jobberknoll/api";
import { AccountRepo, buildService, envDatabaseUrl, Logger } from "@jobberknoll/app";
import { DevLogger, MemoryAccountRepo, PostgresAccountRepo, ProdLogger, TestLogger } from "@jobberknoll/infra";

function setup(accountRepo: AccountRepo, logger: Logger) {
  const service = buildService(accountRepo, logger);
  const api = buildApi(service, logger);
  return { api, accountRepo, logger };
}

export const setupDev = () => {
  const logger = new DevLogger();
  return setup(new MemoryAccountRepo(logger), logger);
};

export const setupProd = async () => {
  const logger = new ProdLogger();
  return setup(await PostgresAccountRepo.setup(envDatabaseUrl(), logger), logger);
};

export const setupTest = () => {
  const logger = new TestLogger();
  return setup(new MemoryAccountRepo(logger), logger);
};
