import type { AccountRepo } from "~/interfaces/mod.ts";
import type { Logger } from "~/shared/mod.ts";
import {
  CreateAccountUseCase,
  GetAccountByIdUseCase,
  GetHealthUseCase,
} from "~/use-cases/mod.ts";

export type Service = {
  createAccount: CreateAccountUseCase;
  getAccountById: GetAccountByIdUseCase;
  getHealth: GetHealthUseCase;
};

export function buildService(
  accountRepo: AccountRepo,
  logger: Logger,
): Service {
  const createAccount = new CreateAccountUseCase(accountRepo, logger);
  const getAccountById = new GetAccountByIdUseCase(accountRepo, logger);
  const getHealth = new GetHealthUseCase(logger);

  return {
    createAccount,
    getAccountById,
    getHealth,
  };
}
