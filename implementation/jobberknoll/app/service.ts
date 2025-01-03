import type { AccountRepo } from "~/interfaces/mod.ts";
import type { Logger } from "~/shared/mod.ts";
import * as c from "~/use-cases/mod.ts";

export type Service = {
  createAccount: c.CreateAccountUseCase;
  deleteAccount: c.DeleteAccountUseCase;
  getAccountById: c.GetAccountByIdUseCase;
  getHealth: c.GetHealthUseCase;
};

export function buildService(accountRepo: AccountRepo, logger: Logger): Service {
  const createAccount = new c.CreateAccountUseCase(accountRepo, logger);
  const deleteAccount = new c.DeleteAccountUseCase(accountRepo, logger);
  const getAccountById = new c.GetAccountByIdUseCase(accountRepo, logger);
  const getHealth = new c.GetHealthUseCase(logger);

  return {
    createAccount,
    deleteAccount,
    getAccountById,
    getHealth,
  };
}
