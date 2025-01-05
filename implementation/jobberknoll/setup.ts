import { buildApi } from "@jobberknoll/api";
import { AccountRepo, buildService, envDatabaseUrl, Logger } from "@jobberknoll/app";
import { devLogTransport, MemoryAccountRepo, PostgresAccountRepo, prodLogTransport } from "@jobberknoll/infra";

function setup(accountRepo: AccountRepo, logger: Logger) {
  const service = buildService(accountRepo, logger);
  const api = buildApi(service, logger);
  return { api, accountRepo, logger };
}

export const setupDev = () => {
  const logger = new Logger([devLogTransport]);
  return setup(new MemoryAccountRepo(logger), logger);
};

export const setupProd = async () => {
  const logger = new Logger([prodLogTransport]);
  return setup(await PostgresAccountRepo.setup(envDatabaseUrl(), logger), logger);
};

export const setupTest = () => {
  const logger = new Logger();
  return setup(new MemoryAccountRepo(logger), logger);
};
