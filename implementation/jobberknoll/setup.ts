import { buildApi } from "@jobberknoll/api";
import {
  type AccountRepo,
  buildService,
  envDatabaseUrl,
  envJwtAlgorithm,
  envJwtPrivateKey,
  envJwtPublicKey,
  JwtHandler,
  type Logger,
} from "@jobberknoll/app";
import { DevLogger, MemoryAccountRepo, PostgresAccountRepo, ProdLogger, TestLogger } from "@jobberknoll/infra";

type Factory<T> = (logger: Logger) => T | Promise<T>;

async function setup(logger: Logger, accountRepoFactory: Factory<AccountRepo>, jwtHandlerFactory: Factory<JwtHandler>) {
  const accountRepo = await accountRepoFactory(logger);
  const jwtHandler = await jwtHandlerFactory(logger);
  const service = buildService(logger, accountRepo, jwtHandler);
  const api = buildApi(logger, service);
  return { api, accountRepo, jwtHandler, logger };
}

export const setupDev = () =>
  setup(
    new DevLogger(),
    (l) => new MemoryAccountRepo(l),
    () => JwtHandler.setup(envJwtAlgorithm(), envJwtPrivateKey(), envJwtPublicKey()),
  );

export const setupProd = () =>
  setup(
    new ProdLogger(),
    (l) => PostgresAccountRepo.setup(l, envDatabaseUrl()),
    () => JwtHandler.setup(envJwtAlgorithm(), envJwtPrivateKey(), envJwtPublicKey()),
  );

export const setupTest = () =>
  setup(
    new TestLogger(),
    (l) => new MemoryAccountRepo(l),
    () => JwtHandler.setupMockForTesting("ES384"),
  );
