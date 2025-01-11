import { type Account, invalidAccountData, type InvalidAccountDataError } from "@jobberknoll/core/domain";
import { err, ok, type Result, uuid } from "@jobberknoll/core/shared";
import type { AccountRepo, Logger } from "~/interfaces/mod.ts";
import type { Ctx } from "~/shared/ctx.ts";
import { UseCase } from "./use-case.ts";

type CreateAccountReq = {
  type: "driver" | "inspector";
  fullName: string;
  email: string;
  password: string;
};

export class CreateAccountUseCase extends UseCase<CreateAccountReq, Account, InvalidAccountDataError> {
  public constructor(logger: Logger, private readonly accountRepo: AccountRepo) {
    super(logger);
  }

  protected async handle(ctx: Ctx, req: CreateAccountReq): Promise<Result<Account, InvalidAccountDataError>> {
    if (await this.accountRepo.isEmailTaken(ctx, req.email)) {
      return err(invalidAccountData("email"));
    }

    const account = {
      id: uuid(),
      type: req.type,
      fullName: req.fullName,
      email: req.email.toLowerCase(),
      hashedPassword: req.password, // TODO: hash password
      lastModified: Math.floor(Date.now() / 1000),
    };

    await this.accountRepo.createAccount(ctx, account);
    this.audit("AccountCreated", account.id);

    // TODO: send the welcome email

    return ok(account);
  }
}
