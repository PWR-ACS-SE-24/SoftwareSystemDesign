import type { AccountRepo } from "~/interfaces/mod.ts";
import type { Logger } from "~/shared/mod.ts";
import { GetAccountByIdUseCase } from "~/use-cases/mod.ts";

export type Service = {
  getAccountById: GetAccountByIdUseCase;
};

export function buildService(
  accountRepo: AccountRepo,
  logger: Logger,
): Service {
  const getAccountById = new GetAccountByIdUseCase(accountRepo, logger);

  return {
    getAccountById,
  };
}
