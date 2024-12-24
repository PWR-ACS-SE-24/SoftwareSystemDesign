import type { Account, AccountNotFoundError } from "@jobberknoll/core/domain";
import type { Result, UUID } from "@jobberknoll/core/shared";
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
    return await this.accountRepo.getAccountById(id);
  }
}
