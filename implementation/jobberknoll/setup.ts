import { buildApi } from "@jobberknoll/api";
import { AccountRepo, buildService, Logger } from "@jobberknoll/app";
import { MemoryAccountRepo, prettyLogTransport } from "@jobberknoll/infra";

function setup(accountRepo: AccountRepo, logger: Logger) {
  const service = buildService(accountRepo, logger);
  const api = buildApi(service, logger);
  return { api, accountRepo, logger };
}

export const setupProd = () =>
  setup(new MemoryAccountRepo(), new Logger([prettyLogTransport()]));

export const setupTest = () => setup(new MemoryAccountRepo(), new Logger());
