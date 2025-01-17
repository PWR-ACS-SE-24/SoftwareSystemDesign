import type { Account, AccountNotFoundError } from "@jobberknoll/core/domain";
import type { Result, UUID } from "@jobberknoll/core/shared";
import type { AccountRepo, Logger } from "~/interfaces/mod.ts";
import type { Ctx } from "~/shared/mod.ts";
import { UseCase } from "./use-case.ts";

type GetAccountByIdReq = { accountId: UUID };

export class GetAccountByIdUseCase extends UseCase<GetAccountByIdReq, Account, AccountNotFoundError> {
  public constructor(logger: Logger, private readonly accountRepo: AccountRepo) {
    super(logger);
  }

  protected async handle(ctx: Ctx, { accountId }: GetAccountByIdReq): Promise<Result<Account, AccountNotFoundError>> {
    return await this.accountRepo.getAccountById(ctx, accountId);
  }
}
