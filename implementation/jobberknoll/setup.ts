import { buildApi } from "@jobberknoll/api";
import { AccountRepo, buildService, envDatabaseUrl, Logger } from "@jobberknoll/app";
import { DevLogger, MemoryAccountRepo, PostgresAccountRepo, ProdLogger, TestLogger } from "@jobberknoll/infra";

type Factory<T> = (logger: Logger) => T | Promise<T>;

async function setup(logger: Logger, accountRepoFactory: Factory<AccountRepo>) {
  const accountRepo = await accountRepoFactory(logger);
  const service = buildService(logger, accountRepo);
  const api = buildApi(logger, service);
  return { api, accountRepo, logger };
}

export const setupDev = () =>
  setup(
    new DevLogger(),
    (l) => new MemoryAccountRepo(l),
  );

export const setupProd = () =>
  setup(
    new ProdLogger(),
    async (l) => await PostgresAccountRepo.setup(l, envDatabaseUrl()),
  );

export const setupTest = () =>
  setup(
    new TestLogger(),
    (l) => new MemoryAccountRepo(l),
  );
