import { type AccountNotFoundError, invalidAccountData, type InvalidAccountDataError } from "@jobberknoll/core/domain";
import { err, isErr, ok, type Result, type UUID } from "@jobberknoll/core/shared";
import type { AccountRepo, Logger } from "~/interfaces/mod.ts";
import { hashPassword, verifyPassword } from "~/security/mod.ts";
import type { Ctx } from "~/shared/mod.ts";
import type { GetAccountByIdUseCase } from "./get-account-by-id-use-case.ts";
import { UseCase } from "./use-case.ts";

type EditAccountPasswordReq = {
  accountId: UUID;
  oldPassword: string;
  newPassword: string;
};

export class EditAccountPasswordUseCase
  extends UseCase<EditAccountPasswordReq, void, InvalidAccountDataError | AccountNotFoundError> {
  public constructor(
    logger: Logger,
    private readonly accountRepo: AccountRepo,
    private readonly getAccountById: GetAccountByIdUseCase,
  ) {
    super(logger);
  }

  protected async handle(
    ctx: Ctx,
    req: EditAccountPasswordReq,
  ): Promise<Result<void, InvalidAccountDataError | AccountNotFoundError>> {
    const accountResult = await this.getAccountById.invoke(ctx, { accountId: req.accountId });
    if (isErr(accountResult)) return accountResult;
    const account = accountResult.value;

    if (!await verifyPassword(req.oldPassword, account.hashedPassword)) {
      return err(invalidAccountData("oldPassword"));
    }

    if (req.oldPassword === req.newPassword) {
      return err(invalidAccountData("newPassword"));
    }

    await this.accountRepo.editAccount(ctx, {
      ...account,
      hashedPassword: await hashPassword(req.newPassword),
      lastModified: Math.floor(Date.now() / 1000),
    });

    this.audit("AccountPasswordEdited", account.id);
    // TODO: send the password change email
    return ok(undefined);
  }
}
