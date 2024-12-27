import type { AccountRepo } from "~/interfaces/mod.ts";
import { GetAccountByIdUseCase } from "~/use-cases/mod.ts";

export type Service = {
  getAccountById: GetAccountByIdUseCase;
};

export function buildService(accountRepo: AccountRepo): Service {
  const getAccountById = new GetAccountByIdUseCase(accountRepo);

  return {
    getAccountById,
  };
}
