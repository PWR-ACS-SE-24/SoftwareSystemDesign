import type { AccountRepo } from "~/interfaces/mod.ts";
import type { Logger } from "~/shared/mod.ts";
import {
  CreateAccountUseCase,
  DeleteAccountUseCase,
  GetAccountByIdUseCase,
  GetHealthUseCase,
} from "~/use-cases/mod.ts";

export type Service = {
  createAccount: CreateAccountUseCase;
  deleteAccount: DeleteAccountUseCase;
  getAccountById: GetAccountByIdUseCase;
  getHealth: GetHealthUseCase;
};

export function buildService(
  accountRepo: AccountRepo,
  logger: Logger,
): Service {
  const createAccount = new CreateAccountUseCase(accountRepo, logger);
  const deleteAccount = new DeleteAccountUseCase(accountRepo, logger);
  const getAccountById = new GetAccountByIdUseCase(accountRepo, logger);
  const getHealth = new GetHealthUseCase(logger);

  return {
    createAccount,
    deleteAccount,
    getAccountById,
    getHealth,
  };
}
