import type { AccountRepo, Logger } from "~/interfaces/mod.ts";
import * as c from "~/use-cases/mod.ts";

export type Service = {
  createAccount: c.CreateAccountUseCase;
  deleteAccount: c.DeleteAccountUseCase;
  getAccountById: c.GetAccountByIdUseCase;
  editAccountName: c.EditAccountNameUseCase;
  editAccountPhone: c.EditAccountPhoneUseCase;
  getHealth: c.GetHealthUseCase;
};

export function buildService(logger: Logger, accountRepo: AccountRepo): Service {
  const createAccount = new c.CreateAccountUseCase(logger, accountRepo);
  const deleteAccount = new c.DeleteAccountUseCase(logger, accountRepo);
  const getAccountById = new c.GetAccountByIdUseCase(logger, accountRepo);
  const editAccountName = new c.EditAccountNameUseCase(logger, accountRepo, getAccountById);
  const editAccountPhone = new c.EditAccountPhoneUseCase(logger, accountRepo, getAccountById);
  const getHealth = new c.GetHealthUseCase(logger, accountRepo);

  return {
    createAccount,
    deleteAccount,
    getAccountById,
    editAccountName,
    editAccountPhone,
    getHealth,
  };
}
