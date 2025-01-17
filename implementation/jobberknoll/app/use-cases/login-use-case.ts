import { invalidAccountData, type InvalidAccountDataError } from "@jobberknoll/core/domain";
import { err, isErr, ok, type Result } from "@jobberknoll/core/shared";
import type { AccountRepo, Logger } from "~/interfaces/mod.ts";
import { type JwtHandler, type Tokens, verifyPassword } from "~/security/mod.ts";
import type { Ctx } from "~/shared/mod.ts";
import { UseCase } from "./use-case.ts";

type LoginReq = { email: string; password: string };

export class LoginUseCase extends UseCase<LoginReq, Tokens, InvalidAccountDataError> {
  public constructor(
    logger: Logger,
    private readonly accountRepo: AccountRepo,
    private readonly jwtHandler: JwtHandler,
  ) {
    super(logger);
  }

  protected async handle(
    ctx: Ctx,
    req: LoginReq,
  ): Promise<Result<Tokens, InvalidAccountDataError>> {
    const accountResult = await this.accountRepo.getAccountByEmail(ctx, req.email);
    if (isErr(accountResult)) return accountResult;
    const account = accountResult.value;

    if (!await verifyPassword(req.password, account.hashedPassword)) {
      return err(invalidAccountData("password"));
    }

    return ok(await this.jwtHandler.createTokens(account));
  }
}
