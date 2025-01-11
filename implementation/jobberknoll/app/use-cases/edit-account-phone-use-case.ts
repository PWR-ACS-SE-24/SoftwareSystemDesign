import type { AccountNotFoundError } from "@jobberknoll/core/domain";
import { isErr, ok, type Result, type UUID } from "@jobberknoll/core/shared";
import type { AccountRepo, Logger } from "~/interfaces/mod.ts";
import type { Ctx } from "~/shared/ctx.ts";
import type { GetAccountByIdUseCase } from "./get-account-by-id-use-case.ts";
import { UseCase } from "./use-case.ts";

type EditAccountPhoneReq = {
  accountId: UUID;
  phoneNumber: string | null;
};

export class EditAccountPhoneUseCase extends UseCase<EditAccountPhoneReq, void, AccountNotFoundError> {
  public constructor(
    logger: Logger,
    private readonly accountRepo: AccountRepo,
    private readonly getAccountById: GetAccountByIdUseCase,
  ) {
    super(logger);
  }

  protected async handle(
    ctx: Ctx,
    req: EditAccountPhoneReq,
  ): Promise<Result<void, AccountNotFoundError>> {
    const accountResult = await this.getAccountById.invoke(ctx, { accountId: req.accountId });
    if (isErr(accountResult)) return accountResult;
    const account = accountResult.value;
    if (account.type !== "passenger") throw new Error("account is not a passenger"); // SAFETY: this means that the use case is being invoked incorrectly, so 5xx is appropriate

    await this.accountRepo.editAccount(ctx, {
      ...account,
      phoneNumber: req.phoneNumber,
      lastModified: Math.floor(Date.now() / 1000),
    });

    this.audit("AccountPhoneEdited", account.id);
    return ok(undefined);
  }
}
