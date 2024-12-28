import { buildApp, IntController } from "@jobberknoll/api";
import { buildService, Logger } from "@jobberknoll/app";
import type { Account } from "@jobberknoll/core/domain";
import { MemoryAccountRepo, prettyLogTransport } from "@jobberknoll/infra";

export function setupProd() {
  const logger = new Logger([prettyLogTransport()]);
  // TODO @tchojnacki: Replace with a persistent repository
  const accountRepo = new MemoryAccountRepo();
  const service = buildService(accountRepo, logger);
  const intController = new IntController(service, logger);
  const app = buildApp([intController]);
  return { app, logger };
}

type SetupTestOptions = {
  seededAccounts?: Account[];
};

export function setupTest(options: SetupTestOptions = {}) {
  const { seededAccounts = [] } = options;
  const logger = new Logger();
  const accountRepo = new MemoryAccountRepo(seededAccounts);
  const service = buildService(accountRepo, logger);
  const intController = new IntController(service, logger);
  const app = buildApp([intController]);
  return { app, logger };
}
