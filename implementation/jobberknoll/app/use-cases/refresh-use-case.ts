import { invalidCredentials, type InvalidCredentialsError } from "@jobberknoll/core/domain";
import { err, isErr, isNone, ok, type Result } from "@jobberknoll/core/shared";
import type { Logger } from "~/interfaces/mod.ts";
import type { JwtHandler, Tokens } from "~/security/mod.ts";
import type { Ctx } from "~/shared/mod.ts";
import type { GetAccountByIdUseCase } from "./get-account-by-id-use-case.ts";
import { UseCase } from "./use-case.ts";

type RefreshReq = { refreshToken: string };

export class RefreshUseCase extends UseCase<RefreshReq, Tokens, InvalidCredentialsError> {
  public constructor(
    logger: Logger,
    private readonly getAccountById: GetAccountByIdUseCase,
    private readonly jwtHandler: JwtHandler,
  ) {
    super(logger);
  }

  protected async handle(
    ctx: Ctx,
    { refreshToken }: RefreshReq,
  ): Promise<Result<Tokens, InvalidCredentialsError>> {
    const option = await this.jwtHandler.verifyRefreshToken(refreshToken);
    if (isNone(option)) return err(invalidCredentials("refreshToken"));
    const { accountId, issuedAt } = option.value;

    const result = await this.getAccountById.invoke(ctx, { accountId });
    if (isErr(result)) return err(invalidCredentials("refreshToken.accountId"));
    const account = result.value;

    if (account.lastModified > issuedAt) return err(invalidCredentials("refreshToken.issuedAt"));

    return ok(await this.jwtHandler.createTokens(account));
  }
}
