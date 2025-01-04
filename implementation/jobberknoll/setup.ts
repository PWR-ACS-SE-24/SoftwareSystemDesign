import { buildApi } from "@jobberknoll/api";
import { AccountRepo, buildService, envDatabaseUrl, Logger } from "@jobberknoll/app";
import { devLogTransport, MemoryAccountRepo, PostgresAccountRepo, prodLogTransport } from "@jobberknoll/infra";

function setup(accountRepo: AccountRepo, logger: Logger) {
  const service = buildService(accountRepo, logger);
  const api = buildApi(service, logger);
  return { api, accountRepo, logger };
}

export const setupDev = () =>
  setup(
    new MemoryAccountRepo(),
    new Logger([devLogTransport]),
  );

export const setupProd = async () =>
  setup(
    await PostgresAccountRepo.setup(envDatabaseUrl()),
    new Logger([prodLogTransport]),
  );

export const setupTest = () =>
  setup(
    new MemoryAccountRepo(),
    new Logger(),
  );
