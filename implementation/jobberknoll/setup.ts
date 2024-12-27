import { buildApp, IntController } from "@jobberknoll/api";
import { buildService } from "@jobberknoll/app";
import type { Account } from "@jobberknoll/core/domain";
import { MemoryAccountRepo } from "@jobberknoll/infra";

export function setupProd() {
  // TODO @tchojnacki: Replace with a persistent repository
  const accountRepo = new MemoryAccountRepo();
  const service = buildService(accountRepo);
  const intController = new IntController(service);
  return buildApp([intController]);
}

type SetupTestOptions = {
  seededAccounts?: Account[];
};

export function setupTest(options: SetupTestOptions = {}) {
  const { seededAccounts = [] } = options;
  const accountRepo = new MemoryAccountRepo(seededAccounts);
  const service = buildService(accountRepo);
  const intController = new IntController(service);
  return buildApp([intController]);
}
