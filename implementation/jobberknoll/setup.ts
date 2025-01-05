import { buildApi } from "@jobberknoll/api";
import { AccountRepo, buildService, envDatabaseUrl, Logger } from "@jobberknoll/app";
import { MemoryAccountRepo, PostgresAccountRepo, prettyLogTransport } from "@jobberknoll/infra";

function setup(accountRepo: AccountRepo, logger: Logger) {
  const service = buildService(accountRepo, logger);
  const api = buildApi(service, logger);
  return { api, accountRepo, logger };
}

export const setupDev = () =>
  setup(
    new MemoryAccountRepo(),
    new Logger([prettyLogTransport()]),
  );

export const setupProd = async () =>
  setup(
    await PostgresAccountRepo.setup(envDatabaseUrl()),
    new Logger([prettyLogTransport()]),
  );

export const setupTest = () =>
  setup(
    new MemoryAccountRepo(),
    new Logger(),
  );
