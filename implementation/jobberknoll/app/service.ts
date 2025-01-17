import type { AccountRepo, Logger } from "~/interfaces/mod.ts";
import type { JwtHandler } from "~/security/mod.ts";
import * as c from "~/use-cases/mod.ts";

export type Service = {
  register: c.RegisterUseCase;
  createAccount: c.CreateAccountUseCase;
  deleteAccount: c.DeleteAccountUseCase;
  getAccountById: c.GetAccountByIdUseCase;
  editAccountName: c.EditAccountNameUseCase;
  editAccountPassword: c.EditAccountPasswordUseCase;
  editAccountPhone: c.EditAccountPhoneUseCase;
  getHealth: c.GetHealthUseCase;
  getJwks: c.GetJwksUseCase;
};

export function buildService(logger: Logger, accountRepo: AccountRepo, jwtHandler: JwtHandler): Service {
  const register = new c.RegisterUseCase(logger, accountRepo);
  const createAccount = new c.CreateAccountUseCase(logger, accountRepo);
  const deleteAccount = new c.DeleteAccountUseCase(logger, accountRepo);
  const getAccountById = new c.GetAccountByIdUseCase(logger, accountRepo);
  const editAccountName = new c.EditAccountNameUseCase(logger, accountRepo, getAccountById);
  const editAccountPassword = new c.EditAccountPasswordUseCase(logger, accountRepo, getAccountById);
  const editAccountPhone = new c.EditAccountPhoneUseCase(logger, accountRepo, getAccountById);
  const getHealth = new c.GetHealthUseCase(logger, accountRepo);
  const getJwks = new c.GetJwksUseCase(logger, jwtHandler);

  return {
    register,
    createAccount,
    deleteAccount,
    getAccountById,
    editAccountName,
    editAccountPassword,
    editAccountPhone,
    getHealth,
    getJwks,
  };
}
