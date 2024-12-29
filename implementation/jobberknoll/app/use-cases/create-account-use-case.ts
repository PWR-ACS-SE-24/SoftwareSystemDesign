import {
  type Account,
  invalidAccountData,
  type InvalidAccountDataError,
} from "@jobberknoll/core/domain";
import { err, ok, type Result, uuid } from "@jobberknoll/core/shared";
import type { AccountRepo } from "~/interfaces/mod.ts";
import type { Logger } from "~/shared/mod.ts";
import { UseCase } from "./use-case.ts";

type CreateAccountReq = {
  type: "driver" | "inspector";
  fullName: string;
  email: string;
  password: string;
};

export class CreateAccountUseCase extends UseCase<
  CreateAccountReq,
  Account,
  InvalidAccountDataError
> {
  public constructor(
    private readonly accountRepo: AccountRepo,
    logger: Logger,
  ) {
    super(logger);
  }

  protected async handle(
    req: CreateAccountReq,
  ): Promise<Result<Account, InvalidAccountDataError>> {
    if (await this.accountRepo.isEmailTaken(req.email)) {
      return err(invalidAccountData("email"));
    }

    const account = {
      id: uuid(),
      type: req.type,
      fullName: req.fullName,
      email: req.email,
      hashedPassword: req.password, // TODO: hash password
      isActive: true,
      lastModified: Date.now(),
    };

    await this.accountRepo.createAccount(account);

    return ok(account);
  }
}
