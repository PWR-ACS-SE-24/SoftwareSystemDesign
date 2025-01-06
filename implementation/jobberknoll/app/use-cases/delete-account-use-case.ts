import type { AccountNotFoundError } from "@jobberknoll/core/domain";
import { err, isSome, ok, type Result, type UUID } from "@jobberknoll/core/shared";
import type { AccountRepo, Logger } from "~/interfaces/mod.ts";
import type { Ctx } from "~/shared/ctx.ts";
import { UseCase } from "./use-case.ts";

type DeleteAccountReq = { accountId: UUID };

export class DeleteAccountUseCase extends UseCase<DeleteAccountReq, null, AccountNotFoundError> {
  public constructor(logger: Logger, private readonly accountRepo: AccountRepo) {
    super(logger);
  }

  protected async handle(ctx: Ctx, req: DeleteAccountReq): Promise<Result<null, AccountNotFoundError>> {
    const error = await this.accountRepo.deleteAccount(ctx, req.accountId);
    if (isSome(error)) return err(error.value);
    this.audit("AccountDeleted", req.accountId);
    return ok(null);
  }
}
