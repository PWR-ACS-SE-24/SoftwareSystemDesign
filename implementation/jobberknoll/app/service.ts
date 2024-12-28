import type { AccountRepo } from "~/interfaces/mod.ts";
import type { Logger } from "~/shared/mod.ts";
import { GetAccountByIdUseCase, GetHealthUseCase } from "~/use-cases/mod.ts";

export type Service = {
  getAccountById: GetAccountByIdUseCase;
  getHealth: GetHealthUseCase;
};

export function buildService(
  accountRepo: AccountRepo,
  logger: Logger,
): Service {
  const getAccountById = new GetAccountByIdUseCase(accountRepo, logger);
  const getHealth = new GetHealthUseCase(logger);

  return {
    getAccountById,
    getHealth,
  };
}
