import { type Account, invalidAccountData, type InvalidAccountDataError } from "@jobberknoll/core/domain";
import { err, ok, type Result, uuid } from "@jobberknoll/core/shared";
import type { AccountRepo, Logger } from "~/interfaces/mod.ts";
import { hashPassword } from "~/security/mod.ts";
import type { Ctx } from "~/shared/mod.ts";
import { UseCase } from "./use-case.ts";

type RegisterReq = {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string | null;
};

export class RegisterUseCase extends UseCase<RegisterReq, Account, InvalidAccountDataError> {
  public constructor(logger: Logger, private readonly accountRepo: AccountRepo) {
    super(logger);
  }

  protected async handle(ctx: Ctx, req: RegisterReq): Promise<Result<Account, InvalidAccountDataError>> {
    if (await this.accountRepo.isEmailTaken(ctx, req.email)) {
      return err(invalidAccountData("email"));
    }

    const account = {
      id: uuid(),
      type: "passenger" as const,
      fullName: req.fullName,
      email: req.email.toLowerCase(),
      hashedPassword: await hashPassword(req.password),
      lastModified: Math.floor(Date.now() / 1000),
      phoneNumber: req.phoneNumber,
    };

    await this.accountRepo.createAccount(ctx, account);
    this.audit("AccountCreated", account.id);
    // TODO: send the welcome email
    return ok(account);
  }
}
