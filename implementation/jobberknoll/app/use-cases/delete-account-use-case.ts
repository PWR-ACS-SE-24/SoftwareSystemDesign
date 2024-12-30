import type { AccountNotFoundError } from "@jobberknoll/core/domain";
import {
  err,
  isNone,
  ok,
  type Result,
  type UUID,
} from "@jobberknoll/core/shared";
import type { AccountRepo } from "~/interfaces/mod.ts";
import type { Logger } from "~/shared/mod.ts";
import { UseCase } from "./use-case.ts";

type DeleteAccountReq = {
  accountId: UUID;
};

export class DeleteAccountUseCase extends UseCase<
  DeleteAccountReq,
  null,
  AccountNotFoundError
> {
  public constructor(
    private readonly accountRepo: AccountRepo,
    logger: Logger,
  ) {
    super(logger);
  }

  protected async handle(
    req: DeleteAccountReq,
  ): Promise<Result<null, AccountNotFoundError>> {
    const error = await this.accountRepo.deleteAccount(req.accountId);
    return isNone(error) ? ok(null) : err(error.value);
  }
}
