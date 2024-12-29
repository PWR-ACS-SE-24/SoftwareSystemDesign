import { buildApi } from "@jobberknoll/api";
import { AccountRepo, buildService, Logger } from "@jobberknoll/app";
import type { Account } from "@jobberknoll/core/domain";
import { MemoryAccountRepo, prettyLogTransport } from "@jobberknoll/infra";

type SetupTestOptions = {
  seededAccounts?: Account[];
};

function setup(accountRepo: AccountRepo, logger: Logger) {
  const service = buildService(accountRepo, logger);
  const api = buildApi(service, logger);
  return { api, accountRepo, logger };
}

export const setupProd = () =>
  setup(new MemoryAccountRepo(), new Logger([prettyLogTransport()]));

export const setupTest = ({ seededAccounts = [] }: SetupTestOptions = {}) =>
  setup(new MemoryAccountRepo(seededAccounts), new Logger());
