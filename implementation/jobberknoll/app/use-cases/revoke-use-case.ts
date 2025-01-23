import type { AccountNotFoundError } from "@jobberknoll/core/domain";
import { isErr, ok, type Result, type UUID } from "@jobberknoll/core/shared";
import type { AccountRepo, Logger } from "~/interfaces/mod.ts";
import type { Ctx } from "~/shared/mod.ts";
import type { GetAccountByIdUseCase } from "./get-account-by-id-use-case.ts";
import { UseCase } from "./use-case.ts";

type RevokeReq = { accountId: UUID };

export class RevokeUseCase extends UseCase<RevokeReq, void, AccountNotFoundError> {
  public constructor(
    logger: Logger,
    private readonly accountRepo: AccountRepo,
    private readonly getAccountById: GetAccountByIdUseCase,
  ) {
    super(logger);
  }

  protected async handle(
    ctx: Ctx,
    { accountId }: RevokeReq,
  ): Promise<Result<void, AccountNotFoundError>> {
    const accountResult = await this.getAccountById.invoke(ctx, { accountId });
    if (isErr(accountResult)) return accountResult;
    const account = accountResult.value;

    await this.accountRepo.editAccount(ctx, {
      ...account,
      lastModified: Math.floor(Date.now() / 1000), // NOTE: refresh tokens check the lastModified field to determine if they are still valid
    });

    this.audit("AccountTokensRevoked", account.id);
    return ok(undefined);
  }
}
