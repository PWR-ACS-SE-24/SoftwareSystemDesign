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
import type { Logger } from "~/shared/mod.ts";
import { UseCase } from "./use-case.ts";

type GetAccountByIdReq = {
  accountId: UUID;
};

export class GetAccountByIdUseCase extends UseCase<
  GetAccountByIdReq,
  Account,
  AccountNotFoundError
> {
  constructor(private readonly accountRepo: AccountRepo, logger: Logger) {
    super(logger);
  }

  protected async handle(
    { accountId }: GetAccountByIdReq,
  ): Promise<Result<Account, AccountNotFoundError>> {
    const account = await this.accountRepo.getAccountById(accountId);
    if (isOk(account) && account.value.isActive) {
      return ok(account.value);
    }
    return err(accountNotFoundError(accountId));
  }
}
