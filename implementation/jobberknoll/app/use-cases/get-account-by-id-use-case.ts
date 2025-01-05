import type { Account, AccountNotFoundError } from "@jobberknoll/core/domain";
import type { Result, UUID } from "@jobberknoll/core/shared";
import type { AccountRepo } from "~/interfaces/mod.ts";
import type { Logger } from "~/shared/mod.ts";
import { UseCase } from "./use-case.ts";

type GetAccountByIdReq = { accountId: UUID };

export class GetAccountByIdUseCase extends UseCase<GetAccountByIdReq, Account, AccountNotFoundError> {
  public constructor(private readonly accountRepo: AccountRepo, logger: Logger) {
    super(logger);
  }

  protected async handle({ accountId }: GetAccountByIdReq): Promise<Result<Account, AccountNotFoundError>> {
    return await this.accountRepo.getAccountById(accountId);
  }
}
