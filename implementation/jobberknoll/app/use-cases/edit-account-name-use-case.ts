import type { AccountNotFoundError } from "@jobberknoll/core/domain";
import { isErr, ok, type Result, type UUID } from "@jobberknoll/core/shared";
import type { AccountRepo, Logger } from "~/interfaces/mod.ts";
import type { Ctx } from "~/shared/ctx.ts";
import type { GetAccountByIdUseCase } from "./get-account-by-id-use-case.ts";
import { UseCase } from "./use-case.ts";

type EditAccountNameReq = {
  accountId: UUID;
  fullName: string;
};

export class EditAccountNameUseCase extends UseCase<EditAccountNameReq, void, AccountNotFoundError> {
  public constructor(
    logger: Logger,
    private readonly accountRepo: AccountRepo,
    private readonly getAccountById: GetAccountByIdUseCase,
  ) {
    super(logger);
  }

  protected async handle(ctx: Ctx, req: EditAccountNameReq): Promise<Result<void, AccountNotFoundError>> {
    const accountResult = await this.getAccountById.invoke(ctx, { accountId: req.accountId });
    if (isErr(accountResult)) return accountResult;
    const account = accountResult.value;

    await this.accountRepo.editAccount(ctx, {
      ...account,
      fullName: req.fullName,
      lastModified: Math.floor(Date.now() / 1000),
    });

    this.audit("AccountNameEdited", account.id);
    return ok(undefined);
  }
}
