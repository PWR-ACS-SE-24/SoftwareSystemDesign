import {
  type Account,
  type AccountNotFoundError,
  accountNotFoundError,
} from "@jobberknoll/core/domain";
import {
  err,
  isOk,
  ok,
  type Result,
  type UUID,
} from "@jobberknoll/core/shared";
import type { AccountRepo } from "~/interfaces/mod.ts";
import { UseCase } from "./use-case.ts";

export class GetAccountByIdUseCase extends UseCase<
  UUID,
  Account,
  AccountNotFoundError
> {
  constructor(private readonly accountRepo: AccountRepo) {
    super();
  }

  protected async handle(
    id: UUID,
  ): Promise<Result<Account, AccountNotFoundError>> {
    const account = await this.accountRepo.getAccountById(id);
    if (isOk(account) && account.value.isActive) {
      return ok(account.value);
    }
    return err(accountNotFoundError(id));
  }
}
